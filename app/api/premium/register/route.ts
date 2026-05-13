import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sql } from "@/lib/db";
import { createGreenCard } from "@/lib/card-utils";
import { hashPassword, signJWT, verifyJWT } from "@/lib/auth-utils";
import { validateEmail, validateMinAge } from "@/lib/utils/validators";

function generateRandomPassword(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const {
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
    } = data;

    if (!nome) {
      return NextResponse.json({ message: "Nome e obrigatorio" }, { status: 400 });
    }

    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!normalizedEmail || !validateEmail(normalizedEmail)) {
      return NextResponse.json({ message: "E-mail valido e obrigatorio" }, { status: 400 });
    }

    if (!birthDate || !validateMinAge(birthDate)) {
      return NextResponse.json({ message: "Voce deve ter pelo menos 18 anos" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("auth_token")?.value;
    let sessionPayload = null;
    try {
      sessionPayload = tokenCookie ? await verifyJWT(tokenCookie) : null;
    } catch (e) {
      // Ignore invalid token.
    }

    let finalUser: any;
    let generatedPassword = null;
    let isUpgrade = false;

    if (sessionPayload && sessionPayload.userId) {
      isUpgrade = true;

      const existingEmail = await sql`
        SELECT id FROM users
        WHERE email = ${normalizedEmail} AND id != ${sessionPayload.userId}
      `;

      if (existingEmail.length > 0) {
        return NextResponse.json({ message: "Este e-mail ja esta em uso" }, { status: 409 });
      }

      const result = await sql`
        UPDATE users
        SET user_category = 'PREMIUM',
            has_premium_accessory = TRUE,
            verification_status = 'APROVADO',
            full_name = ${nome},
            email = ${normalizedEmail},
            birth_date = ${birthDate},
            city = COALESCE(${cidade || null}, city)
        WHERE id = ${sessionPayload.userId}
        RETURNING id, full_name, email, is_admin, verification_status, user_category,
                  has_premium_accessory, birth_date
      `;
      finalUser = result[0];
    } else {
      const existingEmail = await sql`SELECT id FROM users WHERE email = ${normalizedEmail}`;
      if (existingEmail.length > 0) {
        return NextResponse.json({ message: "Este e-mail ja esta em uso" }, { status: 409 });
      }

      generatedPassword = generateRandomPassword(6);
      const hashedPassword = await hashPassword(generatedPassword);

      const result = await sql`
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
      finalUser = result[0];
    }

    const existingGreenCard = await sql`
      SELECT *
      FROM cards
      WHERE owner_id = ${finalUser.id} AND type = 'GREEN'
      LIMIT 1
    `;

    let greenCard = existingGreenCard[0];
    if (existingGreenCard.length === 0) {
      greenCard = await createGreenCard(finalUser.id, finalUser.full_name, finalUser.birth_date);
    } else if (!greenCard.owner_id) {
      const fixedCard = await sql`
        UPDATE cards
        SET owner_id = ${finalUser.id},
            name = COALESCE(name, ${finalUser.full_name}),
            birth_date = COALESCE(birth_date, ${finalUser.birth_date})
        WHERE id = ${greenCard.id}
        RETURNING *
      `;
      greenCard = fixedCard[0];
    }

    if (greenCard?.id) {
      const existingPhysicalRequest = await sql`
        SELECT id FROM physical_card_requests
        WHERE card_id = ${greenCard.id}
          AND status IN ('PENDENTE', 'PAGO', 'EM_PRODUCAO', 'ENVIADO')
        LIMIT 1
      `;

      if (existingPhysicalRequest.length === 0) {
        const physicalCep = cep || "00000-000";
        const physicalAddress =
          endereco || (deliveryMethod === "PARTNER" ? "Retirada local MeetOff" : "Endereco a confirmar");
        const physicalNumber = numero || "S/N";
        const physicalNeighborhood = bairro || "A confirmar";
        const physicalCity = cidade || "A confirmar";
        const physicalState = estado || "NA";

        await sql`
          INSERT INTO physical_card_requests (
            user_id,
            card_id,
            full_name,
            cep,
            address,
            number,
            complement,
            neighborhood,
            city,
            state,
            amount,
            status
          ) VALUES (
            ${finalUser.id},
            ${greenCard.id},
            ${finalUser.full_name},
            ${physicalCep},
            ${physicalAddress},
            ${physicalNumber},
            ${complemento || null},
            ${physicalNeighborhood},
            ${physicalCity},
            ${physicalState},
            ${120.3},
            'EM_PRODUCAO'
          )
        `;
      }
    }

    const orderResult = await sql`
      INSERT INTO premium_accessory_orders (
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
        address_complement
      ) VALUES (
        ${finalUser.id},
        ${accessoryType || "GRAVATA"},
        ${model || null},
        ${deliveryMethod || "RESIDENTIAL"},
        ${cep || null},
        ${estado || null},
        ${cidade || null},
        ${bairro || null},
        ${endereco || null},
        ${numero || null},
        ${complemento || null}
      )
      RETURNING id
    `;
    const orderId = orderResult[0].id;

    const token = await signJWT({
      userId: finalUser.id,
      email: finalUser.email || "",
      isAdmin: finalUser.is_admin || false,
      verificationStatus: finalUser.verification_status,
      userCategory: finalUser.user_category,
      hasPremiumAccessory: finalUser.has_premium_accessory,
    });

    const response = NextResponse.json(
      {
        message: isUpgrade ? "Upgrade realizado com sucesso" : "Usuario criado com sucesso",
        password: generatedPassword,
        login: finalUser.email,
        isUpgrade,
        orderId,
      },
      { status: 201 },
    );

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error creating premium user:", error);
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}
