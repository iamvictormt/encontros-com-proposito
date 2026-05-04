import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { identifier, code } = await request.json();

    if (!identifier || !code) {
      return NextResponse.json({ message: "Identificador e código são obrigatórios" }, { status: 400 });
    }

    // Find user with valid code and identifier (email or phone)
    const users = await sql`
      SELECT id 
      FROM users 
      WHERE (email = ${identifier} OR phone = ${identifier})
      AND reset_password_token = ${code.toUpperCase()} 
      AND reset_password_expires > NOW()
    `;
    const user = users[0];

    if (!user) {
      return NextResponse.json({ message: "Código inválido ou expirado" }, { status: 400 });
    }

    return NextResponse.json({ message: "Código validado com sucesso", valid: true });
  } catch (error) {
    console.error("Verify code error:", error);
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}
