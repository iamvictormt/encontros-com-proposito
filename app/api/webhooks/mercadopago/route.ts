import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { MercadoPagoService } from "@/lib/mercado-pago";

function mapPaymentStatus(status: string) {
  if (status === "approved") return "APPROVED";
  if (status === "rejected") return "REJECTED";
  if (status === "cancelled") return "CANCELLED";
  return "PENDING";
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const dataId = searchParams.get("data.id");

    console.log("Mercado Pago Webhook received:", { type, dataId });

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
          // Se nao for pedido de produto, o orderId e na verdade o userId da Assinatura
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
            await sql`
              UPDATE users
              SET subscription_status = 'pending'
              WHERE id = ${orderId} AND subscription_status != 'canceled'
            `;
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ message: "Webhook processing failed" }, { status: 500 });
  }
}
