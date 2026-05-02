import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { hashPassword, signJWT, validatePhone } from "@/lib/auth-utils";

export async function POST(request: Request) {
  try {
    const { fullName, email, phone, password } = await request.json();

    if (!fullName || (!email && !phone) || !password) {
      return NextResponse.json({ message: "Todos os campos são obrigatórios" }, { status: 400 });
    }

    if (phone && !validatePhone(phone)) {
      return NextResponse.json({ message: "Telefone inválido" }, { status: 400 });
    }

    const userEmail = email && email.trim() !== "" ? email.trim() : null;
    const userPhone = phone && phone.trim() !== "" ? phone.trim() : null;

    // Check if email or phone already exists
    let existingUser = [];
    if (userEmail && userPhone) {
      existingUser = await sql`SELECT id FROM users WHERE email = ${userEmail} OR phone = ${userPhone}`;
    } else if (userEmail) {
      existingUser = await sql`SELECT id FROM users WHERE email = ${userEmail}`;
    } else if (userPhone) {
      existingUser = await sql`SELECT id FROM users WHERE phone = ${userPhone}`;
    }

    if (existingUser.length > 0) {
      return NextResponse.json({ message: "E-mail ou Telefone já cadastrado" }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await sql`
      INSERT INTO users (full_name, email, phone, password_hash)
      VALUES (${fullName}, ${userEmail}, ${userPhone}, ${hashedPassword})
      RETURNING id, full_name, email, phone, is_admin
    `;

    const user = newUser[0];
    const token = await signJWT({
      userId: user.id,
      email: user.email,
      isAdmin: user.is_admin,
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
