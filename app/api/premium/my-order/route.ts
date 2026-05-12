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
    if (!payload) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    const userId = (payload as any).userId || (payload as any).id;

    // Get the most recent premium accessory order for this user
    const orders = await sql`
      SELECT id, accessory_type, accessory_model, delivery_method, status, created_at
      FROM premium_accessory_orders
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 1
    `;

    if (orders.length === 0) {
      return NextResponse.json({ order: null });
    }

    return NextResponse.json({ order: orders[0] });
  } catch (error) {
    console.error("Error fetching user premium order:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
