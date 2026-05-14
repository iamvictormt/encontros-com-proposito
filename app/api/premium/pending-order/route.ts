import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/auth-utils";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const token = (await cookies()).get("auth_token")?.value;
    const payload = token ? await verifyJWT(token).catch(() => null) : null;

    if (!payload?.userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Ensure payment-related columns exist
    try {
      await sql`ALTER TABLE premium_accessory_orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'PENDING'`;
    } catch (e) {}

    const orders = await sql`
      SELECT id, accessory_type, accessory_model, delivery_method, payment_status, created_at
      FROM premium_accessory_orders
      WHERE user_id = ${payload.userId}
        AND (payment_status IS NULL OR payment_status = 'PENDING')
      ORDER BY created_at DESC
      LIMIT 1
    `;

    const userResult = await sql`
      SELECT email FROM users WHERE id = ${payload.userId} LIMIT 1
    `;

    return NextResponse.json({
      order: orders[0] || null,
      userId: payload.userId,
      email: userResult[0]?.email || "",
    });
  } catch (error) {
    console.error("Error fetching pending order:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
