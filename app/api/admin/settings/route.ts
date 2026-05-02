import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyJWT, hashPassword } from "@/lib/auth-utils";
import { cookies } from "next/headers";

export async function PUT(request: Request) {
  const token = (await cookies()).get("auth_token")?.value;
  const payload = token ? await verifyJWT(token) : null;

  if (!payload) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { fullName, email, phone, password } = await request.json();
    
    let result;
    if (password) {
      const hashedPassword = await hashPassword(password);
      result = await sql`
        UPDATE users 
        SET full_name = ${fullName}, email = ${email}, phone = ${phone}, password_hash = ${hashedPassword}
        WHERE id = ${payload.userId}
        RETURNING id, full_name, email, phone, is_admin
      `;
    } else {
      result = await sql`
        UPDATE users 
        SET full_name = ${fullName}, email = ${email}, phone = ${phone}
        WHERE id = ${payload.userId}
        RETURNING id, full_name, email, phone, is_admin
      `;
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json({ message: "Error updating profile" }, { status: 500 });
  }
}
