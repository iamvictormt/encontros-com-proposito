import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { hashPassword, signJWT, verifyJWT } from "@/lib/auth-utils";
import { cookies } from "next/headers";

function generateRandomPassword(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

function generateEmailBase(fullName: string) {
  const parts = fullName.trim().split(" ");
  if (parts.length === 1) {
    return parts[0].toLowerCase();
  }
  const firstName = parts[0].toLowerCase();
  const initials = parts.slice(1).map(p => p[0].toLowerCase()).join("");
  return `${firstName}.${initials}`;
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { 
      nome, 
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
      category 
    } = data;

    if (!nome) {
      return NextResponse.json({ message: "Nome é obrigatório" }, { status: 400 });
    }

    // Check for existing session
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("auth_token")?.value;
    let sessionPayload = null;
    try {
      sessionPayload = tokenCookie ? await verifyJWT(tokenCookie) : null;
    } catch (e) {
      // Ignore invalid token
    }

    let finalUser: any;
    let generatedPassword = null;
    let finalEmail = "";
    let isUpgrade = false;

    if (sessionPayload && sessionPayload.userId) {
      isUpgrade = true;
      const result = await sql`
        UPDATE users 
        SET user_category = 'PREMIUM', 
            has_premium_accessory = TRUE,
            verification_status = 'APROVADO',
            city = COALESCE(${cidade || null}, city)
        WHERE id = ${sessionPayload.userId}
        RETURNING id, full_name, email, is_admin, verification_status, user_category, has_premium_accessory
      `;
      finalUser = result[0];
      finalEmail = finalUser.email;
    } else {
      let emailBase = generateEmailBase(nome);
      finalEmail = `${emailBase}@premium.meetoff.com`;
      
      let isEmailUnique = false;
      let attempts = 0;
      while (!isEmailUnique && attempts < 10) {
        const existingEmail = await sql`SELECT id FROM users WHERE email = ${finalEmail}`;
        if (existingEmail.length === 0) {
          isEmailUnique = true;
        } else {
          const rand = Math.floor(Math.random() * 1000);
          finalEmail = `${emailBase}${rand}@premium.meetoff.com`;
          attempts++;
        }
      }

      if (!isEmailUnique) {
        return NextResponse.json({ message: "Erro ao gerar e-mail único. Tente novamente." }, { status: 500 });
      }

      generatedPassword = generateRandomPassword(6);
      const hashedPassword = await hashPassword(generatedPassword);
      const defaultBirthDate = "1990-01-01"; 

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
          ${finalEmail},
          NULL, 
          ${hashedPassword}, 
          ${defaultBirthDate}, 
          'PREMIUM', 
          TRUE, 
          'APROVADO', 
          ${cidade || null}
        )
        RETURNING id, full_name, email, is_admin, verification_status, user_category, has_premium_accessory
      `;
      finalUser = result[0];
    }

    // Create the order
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
        ${accessoryType || 'GRAVATA'},
        ${model || null},
        ${deliveryMethod || 'RESIDENTIAL'},
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
      hasPremiumAccessory: finalUser.has_premium_accessory
    });

    const response = NextResponse.json({ 
      message: isUpgrade ? "Upgrade realizado com sucesso" : "Usuário criado com sucesso",
      password: generatedPassword,
      login: finalEmail,
      isUpgrade,
      orderId
    }, { status: 201 });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error creating premium user:", error);
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}
