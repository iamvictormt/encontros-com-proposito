import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { hashPassword, signJWT, validatePhone } from "@/lib/auth-utils";
import { validateMinAge } from "@/lib/utils/validators";

export async function POST(request: Request) {
  try {
    const { fullName, email, phone, password, birthDate, userCategory, city } = await request.json();

    if (!fullName || (!email && !phone) || !password || !birthDate) {
      return NextResponse.json({ message: "Todos os campos são obrigatórios" }, { status: 400 });
    }

    if (!validateMinAge(birthDate)) {
      return NextResponse.json({ message: "Você deve ter pelo menos 18 anos" }, { status: 400 });
    }

    if (phone && !validatePhone(phone)) {
      return NextResponse.json({ message: "Telefone inválido" }, { status: 400 });
    }

    const userEmail = email && email.trim() !== "" ? email.trim() : null;
    const userPhone = phone && phone.trim() !== "" ? phone.trim() : null;

    // Check if email or phone already exists
    if (userEmail) {
      const existingEmail = await sql`SELECT id FROM users WHERE email = ${userEmail}`;
      if (existingEmail.length > 0) {
        return NextResponse.json({ message: "Este e-mail já está em uso" }, { status: 409 });
      }
    }

    if (userPhone) {
      const existingPhone = await sql`SELECT id FROM users WHERE phone = ${userPhone}`;
      if (existingPhone.length > 0) {
        return NextResponse.json({ message: "Este telefone já está em uso" }, { status: 409 });
      }
    }

    const hashedPassword = await hashPassword(password);

    const category = userCategory || 'COMUM';
    const initialVerificationStatus = 'PENDENTE';

    const newUser = await sql`
      INSERT INTO users (full_name, email, phone, password_hash, birth_date, user_category, verification_status, city)
      VALUES (${fullName}, ${userEmail}, ${userPhone}, ${hashedPassword}, ${birthDate}, ${category}, ${initialVerificationStatus}, ${city || null})
      RETURNING id, full_name, email, phone, birth_date, is_admin, user_category, verification_status, city, subscription_status, subscription_plan, subscription_expiry
    `;

    const user = newUser[0];
    const token = await signJWT({
      userId: user.id,
      email: user.email,
      isAdmin: user.is_admin,
      verificationStatus: user.verification_status,
    });

    const response = NextResponse.json(
      {
        message: "Usuário criado com sucesso",
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          phone: user.phone,
          isAdmin: user.is_admin,
          userCategory: user.user_category,
          verificationStatus: user.verification_status,
          subscriptionStatus: user.subscription_status,
          subscriptionPlan: user.subscription_plan,
          subscriptionExpiry: user.subscription_expiry,
        },
      },
      { status: 201 },
    );

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}
