import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/mail";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { email: identifier } = await request.json();

    if (!identifier) {
      return NextResponse.json({ message: "Email ou telefone é obrigatório" }, { status: 400 });
    }

    // Check if user exists by email or phone
    const users = await sql`
      SELECT id, email, reset_password_expires 
      FROM users 
      WHERE email = ${identifier} OR phone = ${identifier}
    `;
    const user = users[0];

    if (!user) {
      // For security reasons, don't reveal that the user doesn't exist
      return NextResponse.json({ message: "Se o cadastro existir, você receberá um código." });
    }

    // Check rate limiting: if code already exists and is not expired (sent less than 30 mins ago)
    // Actually, the user says "dura até 30 min", and "só enviará um novo após 30 minutos".
    // So if NOW < reset_password_expires, it means it's still valid, don't send a new one.
    if (user.reset_password_expires && new Date(user.reset_password_expires) > new Date()) {
      return NextResponse.json({ message: "Se o cadastro existir, você receberá um código." });
    }

    // Generate 4-char alphanumeric uppercase code
    const chars = "0123456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // Removed similar looking chars like I, O
    let code = "";
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    const expires = new Date(Date.now() + 1800000); // 30 minutes

    // Save code to DB
    await sql`
      UPDATE users 
      SET reset_password_token = ${code}, 
          reset_password_expires = ${expires.toISOString()} 
      WHERE id = ${user.id}
    `;

    // Send email
    // Note: If identifier was phone, we still send to user's registered email as per user request ("dispara o email")
    const emailResult = await sendPasswordResetEmail(user.email, code);

    if (!emailResult.success) {
      console.error("Failed to send reset email:", emailResult.error);
      return NextResponse.json({ message: "Erro ao enviar código." }, { status: 500 });
    }

    return NextResponse.json({ message: "Se o cadastro existir, você receberá um código." });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}
