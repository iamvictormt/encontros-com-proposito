import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sql } from "@/lib/db";
import { hashPassword, verifyJWT, signJWT } from "@/lib/auth-utils";
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

      // Update user data but keep current category — payment will promote to PREMIUM
      const result = await sql`
        UPDATE users
        SET full_name = ${nome},
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

      // Create user with PENDENTE_PAGAMENTO — will be promoted after payment
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
          'PENDENTE_PAGAMENTO',
          FALSE,
          'PENDENTE',
          ${cidade || null}
        )
        RETURNING id, full_name, email, is_admin, verification_status, user_category,
                  has_premium_accessory, birth_date
      `;
      finalUser = result[0];
    }

    // Pre-create the accessory order so we have an ID for the payment step
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

    // Set a limited auth cookie with PENDENTE_PAGAMENTO status.
    // The middleware will gate this user to /pendente-pagamento until payment is approved.
    const tempToken = await signJWT({
      userId: finalUser.id,
      email: finalUser.email || "",
      isAdmin: finalUser.is_admin || false,
      verificationStatus: finalUser.verification_status || "PENDENTE",
      userCategory: finalUser.user_category || "PENDENTE_PAGAMENTO",
      hasPremiumAccessory: false,
    });

    const res = NextResponse.json(
      {
        message: "Dados registrados. Prossiga para o pagamento.",
        password: generatedPassword,
        login: finalUser.email,
        isUpgrade,
        userId: finalUser.id,
        orderId,
      },
      { status: 201 },
    );

    res.cookies.set("auth_token", tempToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 2, // 2 hours to complete payment
      path: "/",
    });

    return res;
  } catch (error) {
    console.error("Error registering premium user:", error);
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}
