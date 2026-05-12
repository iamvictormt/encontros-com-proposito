import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyJWT } from "@/lib/auth-utils";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    if (!payload || !payload.isAdmin) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const orders = await sql`
      SELECT 
        o.*,
        u.full_name as user_name,
        u.email as user_email
      FROM premium_accessory_orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `;

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching premium orders:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
