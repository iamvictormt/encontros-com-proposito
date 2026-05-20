import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json({ error: "orderId é obrigatório" }, { status: 400 });
    }

    const orders = await sql`
      SELECT id, payment_status
      FROM product_orders
      WHERE id = ${orderId}
      LIMIT 1
    `;

    if (orders.length === 0) {
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
    }

    return NextResponse.json({
      paymentStatus: orders[0].payment_status,
    });
  } catch (error) {
    console.error("Error checking product order status:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
