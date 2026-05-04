import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyJWT, hashPassword } from "@/lib/auth-utils";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function PUT(request: Request) {
  const token = (await cookies()).get("auth_token")?.value;
  const payload = token ? await verifyJWT(token) : null;

  if (!payload) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { fullName, email, phone, password, birthDate } = await request.json();
    
    // Check if new email/phone is already taken by ANOTHER user
    if (email) {
      const existingEmail = await sql`SELECT id FROM users WHERE email = ${email} AND id != ${payload.userId}`;
      if (existingEmail.length > 0) {
        return NextResponse.json({ message: "Este e-mail já está em uso por outro usuário" }, { status: 409 });
      }
    }

    if (phone) {
      const existingPhone = await sql`SELECT id FROM users WHERE phone = ${phone} AND id != ${payload.userId}`;
      if (existingPhone.length > 0) {
        return NextResponse.json({ message: "Este telefone já está em uso por outro usuário" }, { status: 409 });
      }
    }
    
    let result;
    if (password) {
      const hashedPassword = await hashPassword(password);
      result = await sql`
        UPDATE users 
        SET full_name = ${fullName}, email = ${email}, phone = ${phone}, birth_date = ${birthDate}, password_hash = ${hashedPassword}
        WHERE id = ${payload.userId}
        RETURNING id, full_name, email, phone, birth_date, is_admin
      `;
    } else {
      result = await sql`
        UPDATE users 
        SET full_name = ${fullName}, email = ${email}, phone = ${phone}, birth_date = ${birthDate}
        WHERE id = ${payload.userId}
        RETURNING id, full_name, email, phone, birth_date, is_admin
      `;
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json({ message: "Error updating profile" }, { status: 500 });
  }
}
