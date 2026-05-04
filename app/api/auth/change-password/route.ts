import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyJWT, hashPassword, comparePassword } from "@/lib/auth-utils";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const token = (await cookies()).get("auth_token")?.value;
  const payload = token ? await verifyJWT(token) : null;

  if (!payload) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ message: "Dados incompletos" }, { status: 400 });
    }

    // Fetch user with current password hash
    const users = await sql`
      SELECT password_hash FROM users WHERE id = ${payload.userId}
    `;
    const user = users[0];

    if (!user) {
      return NextResponse.json({ message: "Usuário não encontrado" }, { status: 404 });
    }

    // Verify current password
    const isPasswordCorrect = await comparePassword(currentPassword, user.password_hash);
    if (!isPasswordCorrect) {
      return NextResponse.json({ message: "Senha atual incorreta" }, { status: 400 });
    }

    // Hash new password and update
    const hashedNewPassword = await hashPassword(newPassword);
    await sql`
      UPDATE users 
      SET password_hash = ${hashedNewPassword}, updated_at = NOW() 
      WHERE id = ${payload.userId}
    `;

    return NextResponse.json({ message: "Senha alterada com sucesso" });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json({ message: "Erro ao alterar senha" }, { status: 500 });
  }
}
