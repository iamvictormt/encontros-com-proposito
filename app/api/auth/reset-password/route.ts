import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { hashPassword, signJWT } from "@/lib/auth-utils";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { identifier, code, password } = await request.json();

    if (!identifier || !code || !password) {
      return NextResponse.json({ message: "Dados incompletos" }, { status: 400 });
    }

    // Find user with valid code
    const users = await sql`
      SELECT id, full_name, email, is_admin 
      FROM users 
      WHERE (email = ${identifier} OR phone = ${identifier})
      AND reset_password_token = ${code.toUpperCase()} 
      AND reset_password_expires > NOW()
    `;
    const user = users[0];

    if (!user) {
      return NextResponse.json({ message: "Código inválido ou expirado" }, { status: 400 });
    }

    // Update password and clear token
    const hashedPassword = await hashPassword(password);
    await sql`
      UPDATE users 
      SET password_hash = ${hashedPassword}, 
          reset_password_token = NULL, 
          reset_password_expires = NULL,
          updated_at = NOW()
      WHERE id = ${user.id}
    `;

    // Auto-login: Sign JWT and set cookie
    const token = await signJWT({
      userId: user.id,
      email: user.email,
      isAdmin: user.is_admin,
    });

    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return NextResponse.json({ 
      message: "Senha redefinida com sucesso!",
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        isAdmin: user.is_admin
      }
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}
