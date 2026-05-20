import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT, signJWT } from "@/lib/auth-utils";
import { sql } from "@/lib/db";
import { MercadoPagoService } from "@/lib/mercado-pago";
import { resolvePaymentAmount, parseMercadoPagoError } from "@/lib/payments";
import { createGreenCard } from "@/lib/card-utils";

async function ensureColumns() {
  try {
    await sql`ALTER TABLE premium_accessory_orders ADD COLUMN IF NOT EXISTS amount DECIMAL(10, 2)`;
    await sql`ALTER TABLE premium_accessory_orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'PENDING'`;
    await sql`ALTER TABLE premium_accessory_orders ADD COLUMN IF NOT EXISTS mp_payment_id TEXT`;
  } catch (e) {
    console.error("Error ensuring columns:", e);
  }
}

function mapPaymentStatus(status: string) {
  if (status === "approved") return "APPROVED";
  if (status === "rejected") return "REJECTED";
  if (status === "cancelled") return "CANCELLED";
  return "PENDING";
}

export async function POST(request: Request) {
  try {
    await ensureColumns();

    const { orderId, userId, cardTokenId, paymentMethodId, issuerId, installments, payer } =
      await request.json();

    if (!orderId || !cardTokenId || !paymentMethodId) {
      return NextResponse.json({ message: "Dados de pagamento incompletos" }, { status: 400 });
    }

    // Resolve the user — prefer session cookie, fallback to userId from body (new user not yet logged in)
    const token = (await cookies()).get("auth_token")?.value;
    const sessionPayload = token ? await verifyJWT(token).catch(() => null) : null;
    const resolvedUserId = sessionPayload?.userId || userId;

    if (!resolvedUserId) {
      return NextResponse.json({ message: "Usuário não identificado" }, { status: 401 });
    }

    // Fetch the order (must belong to this user)
    const orders = await sql`
      SELECT * FROM premium_accessory_orders
      WHERE id = ${orderId} AND user_id = ${resolvedUserId}
      LIMIT 1
    `;

    if (orders.length === 0) {
      return NextResponse.json({ message: "Pedido não encontrado" }, { status: 404 });
    }

    const order = orders[0];

    // Determine the amount based on accessory type
    let baseAmount = order.accessory_type === "LENCOS" ? 199.0 : 249.0;
    const finalAmount = resolvePaymentAmount(baseAmount);

    const userResults = await sql`
      SELECT id, full_name, email, birth_date, is_admin, verification_status,
             user_category, has_premium_accessory
      FROM users WHERE id = ${resolvedUserId} LIMIT 1
    `;

    if (userResults.length === 0) {
      return NextResponse.json({ message: "Usuário não encontrado" }, { status: 404 });
    }

    const dbUser = userResults[0];

    // Process payment
    let payment: any;
    try {
      payment = await MercadoPagoService.createProductPayment({
        orderId: order.id,
        productName: `Acessório Premium MeetOff - ${order.accessory_model || order.accessory_type}`,
        amount: finalAmount,
        userEmail: dbUser.email || payer?.email,
        cardTokenId,
        paymentMethodId,
        issuerId,
        installments,
        identificationType: payer?.identification?.type,
        identificationNumber: payer?.identification?.number,
        firstName: payer?.first_name,
        lastName: payer?.last_name,
      });
    } catch (payError: any) {
      console.error("Premium pay payment error:", payError);

      const parsedError = parseMercadoPagoError(payError);

      // Update order in DB with rejected status
      await sql`
        UPDATE premium_accessory_orders
        SET payment_status = ${parsedError.status_detail ? 'REJECTED' : 'PENDING'},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${order.id}
      `;

      return NextResponse.json(
        {
          status: parsedError.status_detail || "error",
          message: parsedError.message,
        },
        { status: parsedError.status },
      );
    }

    const paymentStatus = mapPaymentStatus(payment.status);

    // Update order with payment result
    await sql`
      UPDATE premium_accessory_orders
      SET payment_status = ${paymentStatus},
          status = CASE WHEN ${paymentStatus} = 'APPROVED' THEN 'PENDING' ELSE status END,
          mp_payment_id = ${String(payment.id)},
          amount = ${baseAmount},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${order.id}
    `;

    if (paymentStatus !== "APPROVED") {
      return NextResponse.json(
        {
          status: paymentStatus,
          paymentId: payment.id,
          message:
            paymentStatus === "REJECTED"
              ? "Pagamento recusado. Verifique os dados do cartão e tente novamente."
              : "Pagamento não aprovado. Tente novamente.",
        },
        { status: 402 },
      );
    }

    // ✅ Payment approved — NOW promote the user to PREMIUM
    const updatedUser = await sql`
      UPDATE users
      SET user_category = 'PREMIUM',
          has_premium_accessory = TRUE,
          verification_status = 'APROVADO'
      WHERE id = ${resolvedUserId}
      RETURNING id, full_name, email, is_admin, verification_status, user_category,
                has_premium_accessory, birth_date
    `;
    const finalUser = updatedUser[0];

    // Create green card if not already created
    const existingGreenCard = await sql`
      SELECT id FROM cards
      WHERE owner_id = ${resolvedUserId} AND type = 'GREEN'
      LIMIT 1
    `;

    if (existingGreenCard.length === 0 && finalUser.birth_date) {
      await createGreenCard(resolvedUserId, finalUser.full_name, finalUser.birth_date);
    }

    // Also create physical card request for the address
    const greenCard = await sql`
      SELECT id FROM cards WHERE owner_id = ${resolvedUserId} AND type = 'GREEN' LIMIT 1
    `;

    if (greenCard.length > 0) {
      const existingPhysicalRequest = await sql`
        SELECT id FROM physical_card_requests
        WHERE card_id = ${greenCard[0].id}
          AND status IN ('PENDENTE', 'PAGO', 'EM_PRODUCAO', 'ENVIADO')
        LIMIT 1
      `;

      if (existingPhysicalRequest.length === 0) {
        await sql`
          INSERT INTO physical_card_requests (
            user_id, card_id, full_name, cep, address, number,
            complement, neighborhood, city, state, amount, status
          ) VALUES (
            ${resolvedUserId},
            ${greenCard[0].id},
            ${finalUser.full_name},
            ${order.address_cep || "00000-000"},
            ${order.address_street || (order.delivery_method === "PARTNER" ? "Retirada local MeetOff" : "Endereco a confirmar")},
            ${order.address_number || "S/N"},
            ${order.address_complement || null},
            ${order.address_neighborhood || "A confirmar"},
            ${order.address_city || "A confirmar"},
            ${order.address_state || "NA"},
            ${resolvePaymentAmount(120.3)},
            'EM_PRODUCAO'
          )
        `;
      }
    }

    // Sign a new JWT with the PREMIUM status and set the auth cookie
    const newToken = await signJWT({
      userId: finalUser.id,
      email: finalUser.email || "",
      isAdmin: finalUser.is_admin || false,
      verificationStatus: finalUser.verification_status,
      userCategory: finalUser.user_category,
      hasPremiumAccessory: finalUser.has_premium_accessory,
    });

    const response = NextResponse.json({
      status: "APPROVED",
      paymentId: payment.id,
      message: "Pagamento aprovado! Bem-vindo ao MeetOff Premium.",
    });

    response.cookies.set("auth_token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Premium payment error:", error);
    return NextResponse.json(
      { message: error.message || "Erro ao processar pagamento" },
      { status: 500 },
    );
  }
}
