import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT, signJWT, hashPassword } from "@/lib/auth-utils";
import { sql } from "@/lib/db";
import { MercadoPagoService } from "@/lib/mercado-pago";
import { resolvePaymentAmount, parseMercadoPagoError } from "@/lib/payments";
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

    if (!paymentMethodId) {
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

    let finalUserId = resolvedUserId;
    let finalUser: any;

    if (finalUserId) {
      // Fetch existing user details
      const userResults = await sql`
        SELECT id, full_name, email, is_admin, verification_status, user_category,
               has_premium_accessory, birth_date
        FROM users WHERE id = ${finalUserId} LIMIT 1
      `;
      if (userResults.length > 0) {
        finalUser = userResults[0];
      }
    } else {
      // Check if user already exists
      const existingUser = await sql`
        SELECT id FROM users WHERE email = ${normalizedEmail} LIMIT 1
      `;

      if (existingUser.length > 0) {
        return NextResponse.json(
          { message: "Já existe uma conta com este e-mail. Faça login antes de adquirir o acesso premium." },
          { status: 400 }
        );
      }

      // Create new user (initially FREE)
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
          'FREE',
          FALSE,
          'PENDENTE',
          ${cidade || null}
        )
        RETURNING id, full_name, email, is_admin, verification_status, user_category,
                  has_premium_accessory, birth_date
      `;
      finalUser = insertedUser[0];
      finalUserId = finalUser.id;
    }

    if (!finalUser) {
      return NextResponse.json({ message: "Usuário não encontrado" }, { status: 404 });
    }

    // Now, create the accessory order in PENDING status so we get a real order ID!
    const tempOrderId = crypto.randomUUID();
    const orderResult = await sql`
      INSERT INTO premium_accessory_orders (
        id,
        user_id,
        accessory_type,
        accessory_model,
        delivery_method,
        address_cep,
        address_state,
        address_city,
        address_neighborhood,
        address_street,
        address_number,
        address_complement,
        amount,
        payment_status,
        status,
        mp_payment_id
      ) VALUES (
        ${tempOrderId},
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
        'PENDING',
        'PENDING',
        NULL
      )
      RETURNING id
    `;
    const newOrderId = orderResult[0].id;

    // Call Mercado Pago with the actual order ID!
    let payment: any;
    try {
      payment = await MercadoPagoService.createProductPayment({
        orderId: newOrderId,
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
    } catch (payError: any) {
      console.error("Premium checkout payment error:", payError);

      // Revert/delete the pending order if card fails to avoid cluttering DB
      await sql`
        DELETE FROM premium_accessory_orders WHERE id = ${newOrderId}
      `;

      const parsedError = parseMercadoPagoError(payError);
      return NextResponse.json(
        {
          status: parsedError.status_detail || "error",
          message: parsedError.message,
        },
        { status: parsedError.status },
      );
    }

    const paymentStatus = mapPaymentStatus(payment.status);

    if (paymentStatus === "APPROVED") {
      // 1. Upgrade user
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
      finalUser = updatedUser[0] || finalUser;

      // 2. Update order to paid
      await sql`
        UPDATE premium_accessory_orders
        SET payment_status = 'APPROVED',
            status = 'PAGO',
            mp_payment_id = ${String(payment.id)},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${newOrderId}
      `;

      // 3. Create green card if not already created
      const existingGreenCard = await sql`
        SELECT id FROM cards
        WHERE owner_id = ${finalUserId} AND type = 'GREEN'
        LIMIT 1
      `;

      if (finalUserId && existingGreenCard.length === 0 && finalUser.birth_date) {
        await createGreenCard(finalUserId as string, finalUser.full_name as string, finalUser.birth_date as string);
      }

      // 4. Also create physical card request
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

      // 5. Send welcome email
      try {
        await sendPremiumWelcomeEmail(normalizedEmail, password);
      } catch (mailError) {
        console.error("Error sending welcome email:", mailError);
      }

      // 6. Sign JWT
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
    } else if (paymentStatus === "PENDING" && paymentMethodId === "pix") {
      // It's PIX payment!
      await sql`
        UPDATE premium_accessory_orders
        SET mp_payment_id = ${String(payment.id)},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${newOrderId}
      `;

      // Sign JWT with their current category (initially FREE)
      const newToken = await signJWT({
        userId: finalUser.id,
        email: finalUser.email || "",
        isAdmin: finalUser.is_admin || false,
        verificationStatus: finalUser.verification_status,
        userCategory: finalUser.user_category,
        hasPremiumAccessory: finalUser.has_premium_accessory,
      });

      const transactionData = payment.point_of_interaction?.transaction_data;
      const response = NextResponse.json({
        status: "PENDING",
        paymentId: payment.id,
        orderId: newOrderId,
        pix: {
          qrCode: transactionData?.qr_code,
          qrCodeBase64: transactionData?.qr_code_base64,
        },
        message: "Pedido reservado. Realize o pagamento Pix para ativar seu acesso.",
      });

      response.cookies.set("auth_token", newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        path: "/",
      });

      return response;
    } else {
      // Revert/delete the pending order if card fails to avoid cluttering DB
      await sql`
        DELETE FROM premium_accessory_orders WHERE id = ${newOrderId}
      `;

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
  } catch (error: any) {
    console.error("Premium checkout error:", error);
    return NextResponse.json(
      { message: error.message || "Erro ao processar pagamento" },
      { status: 500 },
    );
  }
}
