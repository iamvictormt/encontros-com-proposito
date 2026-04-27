import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { hashPassword, signJWT, validateCPF } from "@/lib/auth-utils";

export async function POST(request: Request) {
  try {
    const { fullName, email, cpf, password } = await request.json();

    if (!fullName || (!email && !cpf) || !password) {
      return NextResponse.json({ message: "Todos os campos são obrigatórios" }, { status: 400 });
    }

    if (cpf && !validateCPF(cpf)) {
      return NextResponse.json({ message: "CPF inválido" }, { status: 400 });
    }

    // Ensure DB allows NULL for CPF
    await sql`ALTER TABLE users ALTER COLUMN cpf DROP NOT NULL`;

    const userEmail = email && email.trim() !== "" ? email.trim() : null;
    const userCpf = cpf && cpf.trim() !== "" ? cpf.trim() : null;

    // Check if email or cpf already exists
    let existingUser = [];
    if (userEmail && userCpf) {
      existingUser = await sql`SELECT id FROM users WHERE email = ${userEmail} OR cpf = ${userCpf}`;
    } else if (userEmail) {
      existingUser = await sql`SELECT id FROM users WHERE email = ${userEmail}`;
    } else if (userCpf) {
      existingUser = await sql`SELECT id FROM users WHERE cpf = ${userCpf}`;
    }

    if (existingUser.length > 0) {
      return NextResponse.json({ message: "E-mail ou CPF já cadastrado" }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await sql`
      INSERT INTO users (full_name, email, cpf, password_hash)
      VALUES (${fullName}, ${userEmail}, ${userCpf}, ${hashedPassword})
      RETURNING id, full_name, email, cpf, is_admin
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
          cpf: user.cpf,
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
