import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT, signJWT, hashPassword } from "@/lib/auth-utils";
import { sql } from "@/lib/db";
import { MercadoPagoService } from "@/lib/mercado-pago";
import { resolvePaymentAmount } from "@/lib/payments";
import { createGreenCard } from "@/lib/card-utils";
import { sendPremiumWelcomeEmail } from "@/lib/mail";

function mapPaymentStatus(status: string) {
  if (status === "approved") return "APPROVED";
  if (status === "rejected") return "REJECTED";
  if (status === "cancelled") return "CANCELLED";
  return "PENDING";
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const {
      // Form Data
      nome,
      email,
      birthDate,
      cep,
      estado,
      cidade,
      bairro,
      endereco,
      numero,
      complemento,
      accessoryType,
      model,
      deliveryMethod,
      password, // The generated password passed from frontend
      
      // Payment Data
      cardTokenId,
      paymentMethodId,
      issuerId,
      installments,
      payer,
    } = data;

    if (!cardTokenId || !paymentMethodId) {
      return NextResponse.json({ message: "Dados de pagamento incompletos" }, { status: 400 });
    }

    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    // Determine the amount based on accessory type
    let baseAmount = accessoryType === "LENCOS" ? 199.0 : 249.0;
    const finalAmount = resolvePaymentAmount(baseAmount);

    // Resolve user if logged in
    const token = (await cookies()).get("auth_token")?.value;
    const sessionPayload = token ? await verifyJWT(token).catch(() => null) : null;
    const resolvedUserId = sessionPayload?.userId;

    // We process the payment first, BEFORE creating the user!
    const payment = await MercadoPagoService.createProductPayment({
      orderId: crypto.randomUUID(), // Just a placeholder for MP
      productName: `Acessório Premium MeetOff - ${model || accessoryType}`,
      amount: finalAmount,
      userEmail: payer?.email || normalizedEmail,
      cardTokenId,
      paymentMethodId,
      issuerId,
      installments,
      identificationType: payer?.identification?.type,
      identificationNumber: payer?.identification?.number,
    });

    const paymentStatus = mapPaymentStatus(payment.status);

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

    // PAYMENT IS APPROVED! Now we create or update the user.
    let finalUserId = resolvedUserId;
    let finalUser: any;

    if (finalUserId) {
      // Update existing user (upgrade)
      const updatedUser = await sql`
        UPDATE users
        SET full_name = ${nome},
            birth_date = ${birthDate},
            city = COALESCE(${cidade || null}, city),
            user_category = 'PREMIUM',
            has_premium_accessory = TRUE,
            verification_status = 'APROVADO'
        WHERE id = ${finalUserId}
        RETURNING id, full_name, email, is_admin, verification_status, user_category,
                  has_premium_accessory, birth_date
      `;
      finalUser = updatedUser[0];
    } else {
      // Create NEW user because payment succeeded
      const hashedPassword = await hashPassword(password || "MeetOff123!");
      const insertedUser = await sql`
        INSERT INTO users (
          full_name,
          email,
          phone,
          password_hash,
          birth_date,
          user_category,
          has_premium_accessory,
          verification_status,
          city
        )
        VALUES (
          ${nome},
          ${normalizedEmail},
          NULL,
          ${hashedPassword},
          ${birthDate},
          'PREMIUM',
          TRUE,
          'APROVADO',
          ${cidade || null}
        )
        RETURNING id, full_name, email, is_admin, verification_status, user_category,
                  has_premium_accessory, birth_date
      `;
      finalUser = insertedUser[0];
      finalUserId = finalUser.id;
    }

    // Create the accessory order
    const orderResult = await sql`
        amount,
        payment_status,
        status,
        mp_payment_id
      ) VALUES (
        ${finalUserId},
        ${accessoryType || "GRAVATA"},
        ${model || null},
        ${deliveryMethod || "RESIDENTIAL"},
        ${cep || null},
        ${estado || null},
        ${cidade || null},
        ${bairro || null},
        ${endereco || null},
        ${numero || null},
        ${complemento || null},
        ${baseAmount},
        ${paymentStatus},
        'PENDING',
        ${String(payment.id)}
      )
      RETURNING id
    `;
    const newOrderId = orderResult[0].id;

    // Create green card if not already created
    const existingGreenCard = await sql`
      SELECT id FROM cards
      WHERE owner_id = ${finalUserId} AND type = 'GREEN'
      LIMIT 1
    `;

    if (finalUserId && existingGreenCard.length === 0 && finalUser.birth_date) {
      await createGreenCard(finalUserId as string, finalUser.full_name as string, finalUser.birth_date as string);
    }

    // Also create physical card request for the address
    const greenCard = await sql`
      SELECT id FROM cards WHERE owner_id = ${finalUserId} AND type = 'GREEN' LIMIT 1
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
            ${finalUserId},
            ${greenCard[0].id},
            ${finalUser.full_name},
            ${cep || "00000-000"},
            ${endereco || (deliveryMethod === "PARTNER" ? "Retirada local MeetOff" : "Endereco a confirmar")},
            ${numero || "S/N"},
            ${complemento || null},
            ${bairro || "A confirmar"},
            ${cidade || "A confirmar"},
            ${estado || "NA"},
            ${resolvePaymentAmount(120.3)},
            'EM_PRODUCAO'
          )
        `;
      }
    }

    // Send welcome email
    try {
      await sendPremiumWelcomeEmail(normalizedEmail, password);
    } catch (mailError) {
      console.error("Error sending welcome email:", mailError);
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
      orderId: newOrderId,
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
    console.error("Premium checkout error:", error);
    return NextResponse.json(
      { message: error.message || "Erro ao processar pagamento" },
      { status: 500 },
    );
  }
}
