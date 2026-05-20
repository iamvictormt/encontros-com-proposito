import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { MercadoPagoService } from "@/lib/mercado-pago";
import { createGreenCard } from "@/lib/card-utils";

function mapPaymentStatus(status: string) {
  if (status === "approved") return "APPROVED";
  if (status === "rejected") return "REJECTED";
  if (status === "cancelled") return "CANCELLED";
  return "PENDING";
}

async function ensureUserSubscriptionPaymentColumns() {
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS mp_subscription_payment_id TEXT`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS mp_subscription_status_detail TEXT`;
}

async function parseWebhookBody(request: Request) {
  const text = await request.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    console.warn("Mercado Pago Webhook received non-JSON body:", text.slice(0, 500));
    return null;
  }
}

async function updateSubscriptionFromAuthorizedPayment(authorizedPayment: any, authorizedPaymentId?: string) {
  const paymentStatus = mapPaymentStatus(authorizedPayment.payment?.status || authorizedPayment.summarized);
  const mpPaymentId = authorizedPayment.payment?.id ? String(authorizedPayment.payment.id) : null;
  const mpStatusDetail = authorizedPayment.payment?.status_detail || null;
  let userId = authorizedPayment.external_reference;

  await ensureUserSubscriptionPaymentColumns();

  if (!userId && authorizedPayment.preapproval_id) {
    const subscription = await MercadoPagoService.getSubscription(String(authorizedPayment.preapproval_id));
    userId = subscription.external_reference;
  }

  if (!userId) {
    console.warn("Mercado Pago authorized payment without user reference:", {
      authorizedPaymentId: authorizedPaymentId || authorizedPayment.id,
      preapprovalId: authorizedPayment.preapproval_id,
      paymentId: authorizedPayment.payment?.id,
    });
    return false;
  }

  if (paymentStatus === "APPROVED") {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    const expiryDate = date.toISOString();

    await sql`
      UPDATE users
      SET subscription_status = 'active',
          subscription_expiry = ${expiryDate},
          mp_subscription_payment_id = COALESCE(${mpPaymentId}, mp_subscription_payment_id),
          mp_subscription_status_detail = ${mpStatusDetail},
          mp_preapproval_id = COALESCE(${authorizedPayment.preapproval_id ? String(authorizedPayment.preapproval_id) : null}, mp_preapproval_id)
      WHERE id = ${String(userId)}
    `;
    return true;
  }

  if (paymentStatus === "REJECTED" || paymentStatus === "CANCELLED") {
    await sql`
      UPDATE users
      SET subscription_status = 'inactive',
          mp_subscription_payment_id = COALESCE(${mpPaymentId}, mp_subscription_payment_id),
          mp_subscription_status_detail = ${mpStatusDetail}
      WHERE id = ${String(userId)} AND subscription_status != 'canceled'
    `;
    return true;
  }

  console.log("Mercado Pago subscription authorized payment still pending:", {
    authorizedPaymentId: authorizedPaymentId || authorizedPayment.id,
    preapprovalId: authorizedPayment.preapproval_id,
    paymentId: authorizedPayment.payment?.id,
    summarized: authorizedPayment.summarized,
    paymentStatus: authorizedPayment.payment?.status,
    paymentStatusDetail: authorizedPayment.payment?.status_detail,
  });
  return false;
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const body = await parseWebhookBody(request);
    const action = searchParams.get("action") || body?.action;
    const type = searchParams.get("type") || body?.type || action?.split(".")[0] || null;
    const dataId = searchParams.get("data.id") || body?.data?.id || null;

    console.log("Mercado Pago Webhook received:", { action, type, dataId });

    if (type === "subscription_preapproval") {
      const subscription = await MercadoPagoService.getSubscription(dataId!);
      
      const userId = subscription.external_reference;
      const status = subscription.status; // 'pending', 'authorized', 'paused', 'cancelled'
      
      if (status === 'cancelled' || status === 'paused') {
        await sql`
          UPDATE users 
          SET subscription_status = ${status === 'cancelled' ? 'canceled' : 'pending'},
              mp_preapproval_id = ${dataId}
          WHERE id = ${userId}
        `;
      } else {
        // Apenas vincula o ID, nao ativa! A ativacao ocorrera via webhook de pagamento.
        await sql`
          UPDATE users 
          SET mp_preapproval_id = ${dataId}
          WHERE id = ${userId}
        `;
      }
    }

    if (type === "subscription_authorized_payment" && dataId) {
      const authorizedPayment = await MercadoPagoService.getAuthorizedPayment(dataId);
      await updateSubscriptionFromAuthorizedPayment(authorizedPayment, dataId);
    }

    if (type === "payment" && dataId) {
      const payment = await MercadoPagoService.getPayment(dataId);
      const orderId = payment.external_reference;
      const paymentStatus = mapPaymentStatus(payment.status);

      if (orderId) {
        // Verifica se e um pedido de produto
        const currentOrders = await sql`
          SELECT product_id, quantity, product_type, payment_status
          FROM product_orders
          WHERE id = ${orderId}
          LIMIT 1
        `;

        if (currentOrders.length > 0) {
          const order = currentOrders[0];
          const isPhysical = order.product_type !== "Digital";
          const fulfillmentStatus = paymentStatus === "APPROVED"
            ? isPhysical ? "PAID" : "DELIVERED"
            : "PENDING";

          await sql`
            UPDATE product_orders
            SET payment_status = ${paymentStatus},
                fulfillment_status = ${fulfillmentStatus},
                mp_payment_id = ${String(payment.id)},
                mp_status_detail = ${payment.status_detail || null},
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${orderId}
          `;

          if (paymentStatus === "APPROVED" && order.payment_status !== "APPROVED" && isPhysical && order.product_id) {
            await sql`
              UPDATE products
              SET stock = GREATEST(stock - ${Number(order.quantity || 1)}, 0)
              WHERE id = ${order.product_id}
            `;
          }
        } else {
          // Check if it's a premium accessory order
          const currentAccessoryOrders = await sql`
            SELECT id, user_id, payment_status, accessory_type, accessory_model, delivery_method,
                   address_cep, address_state, address_city, address_neighborhood, address_street,
                   address_number, address_complement, amount
            FROM premium_accessory_orders
            WHERE id = ${orderId}
            LIMIT 1
          `;

          if (currentAccessoryOrders.length > 0) {
            const accOrder = currentAccessoryOrders[0];
            
            await sql`
              UPDATE premium_accessory_orders
              SET payment_status = ${paymentStatus},
                  mp_payment_id = ${String(payment.id)},
                  status = ${paymentStatus === "APPROVED" ? "PAGO" : "PENDENTE"},
                  updated_at = CURRENT_TIMESTAMP
              WHERE id = ${orderId}
            `;

            if (paymentStatus === "APPROVED" && accOrder.payment_status !== "APPROVED") {
              // Upgrade user
              const updatedUsers = await sql`
                UPDATE users
                SET user_category = 'PREMIUM',
                    has_premium_accessory = TRUE,
                    verification_status = 'APROVADO'
                WHERE id = ${accOrder.user_id}
                RETURNING id, full_name, email, birth_date
              `;

              if (updatedUsers.length > 0) {
                const finalUser = updatedUsers[0];

                // Create green card
                const existingGreenCard = await sql`
                  SELECT id FROM cards
                  WHERE owner_id = ${finalUser.id} AND type = 'GREEN'
                  LIMIT 1
                `;

                let greenCardId = null;
                if (existingGreenCard.length === 0 && finalUser.birth_date) {
                  const newCard = await createGreenCard(finalUser.id, finalUser.full_name, finalUser.birth_date);
                  greenCardId = newCard.id;
                } else if (existingGreenCard.length > 0) {
                  greenCardId = existingGreenCard[0].id;
                }

                // Create physical card request
                if (greenCardId) {
                  const existingPhysicalRequest = await sql`
                    SELECT id FROM physical_card_requests
                    WHERE card_id = ${greenCardId}
                      AND status IN ('PENDENTE', 'PAGO', 'EM_PRODUCAO', 'ENVIADO')
                    LIMIT 1
                  `;

                  if (existingPhysicalRequest.length === 0) {
                    await sql`
                      INSERT INTO physical_card_requests (
                        user_id, card_id, full_name, cep, address, number,
                        complement, neighborhood, city, state, amount, status
                      ) VALUES (
                        ${finalUser.id},
                        ${greenCardId},
                        ${finalUser.full_name},
                        ${accOrder.address_cep || "00000-000"},
                        ${accOrder.address_street || (accOrder.delivery_method === "PARTNER" ? "Retirada local MeetOff" : "Endereco a confirmar")},
                        ${accOrder.address_number || "S/N"},
                        ${accOrder.address_complement || null},
                        ${accOrder.address_neighborhood || "A confirmar"},
                        ${accOrder.address_city || "A confirmar"},
                        ${accOrder.address_state || "NA"},
                        ${accOrder.amount || 120.3},
                        'EM_PRODUCAO'
                      )
                    `;
                  }
                }
              }
            }
          } else {
            // Se nao for pedido de acessorio, o orderId e na verdade o userId da Assinatura
            if (paymentStatus === "APPROVED") {
              const date = new Date();
              date.setDate(date.getDate() + 30); // Adiciona 30 dias de acesso
              const expiryDate = date.toISOString();

              await sql`
                UPDATE users
                SET subscription_status = 'active',
                    subscription_expiry = ${expiryDate}
                WHERE id = ${orderId}
              `;
            } else if (paymentStatus === "REJECTED" || paymentStatus === "CANCELLED") {
              // Pagamento falhou, mantem ou reverte para pendente
              await ensureUserSubscriptionPaymentColumns();
              await sql`
                UPDATE users
                SET subscription_status = 'inactive',
                    mp_subscription_payment_id = ${String(payment.id)},
                    mp_subscription_status_detail = ${payment.status_detail || null}
                WHERE id = ${orderId} AND subscription_status != 'canceled'
              `;
            }
          }
        }
      } else {
        const authorizedPayments = await MercadoPagoService.searchAuthorizedPaymentsByPayment(dataId);
        const authorizedPayment = authorizedPayments[0];

        if (authorizedPayment) {
          await updateSubscriptionFromAuthorizedPayment(authorizedPayment, String(authorizedPayment.id));
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ message: "Webhook processing failed" }, { status: 500 });
  }
}
