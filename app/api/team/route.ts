import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyJWT } from "@/lib/auth-utils";
import { cookies } from "next/headers";

export async function GET() {
  const token = (await cookies()).get("auth_token")?.value;
  const payload = token ? await verifyJWT(token) : null;

  if (!payload || !payload.isAdmin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const team = await sql`SELECT id, full_name, role, avatar, updated_at, is_admin FROM users WHERE is_admin = TRUE OR role != 'Usuário' ORDER BY updated_at DESC`;
    return NextResponse.json(team);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching team" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const token = (await cookies()).get("auth_token")?.value;
  const payload = token ? await verifyJWT(token) : null;

  if (!payload || !payload.isAdmin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, role, isAdmin } = await request.json();
    const result = await sql`
      UPDATE users 
      SET role = ${role}, is_admin = ${isAdmin}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING id, full_name, role, is_admin
    `;
    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json({ message: "Error updating team member" }, { status: 500 });
  }
}
