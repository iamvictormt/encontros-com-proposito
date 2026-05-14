import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { MercadoPagoService } from "@/lib/mercado-pago";

function mapPaymentStatus(status: string) {
  if (status === "approved") return "APPROVED";
  if (status === "rejected") return "REJECTED";
  if (status === "cancelled") return "CANCELLED";
  return "PENDING";
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const dataId = searchParams.get("data.id");

    console.log("Mercado Pago Webhook received:", { type, dataId });

    if (type === "subscription_preapproval") {
      const subscription = await MercadoPagoService.getSubscription(dataId!);
      
      const userId = subscription.external_reference;
      const status = subscription.status; // 'pending', 'authorized', 'paused', 'cancelled'
      
      let dbStatus = 'inactive';
      if (status === 'authorized') dbStatus = 'active';
      else if (status === 'pending') dbStatus = 'pending';
      else if (status === 'cancelled') dbStatus = 'canceled';

      // Fallback expiry: if next_payment_date is null but status is active/authorized, 
      // set it to 30 days from now.
      let expiryDate = subscription.next_payment_date;
      if (!expiryDate && (status === 'authorized' || status === 'active')) {
        const date = new Date();
        date.setDate(date.getDate() + 30);
        expiryDate = date.toISOString();
      }
      
      // Update user status
      await sql`
        UPDATE users 
        SET subscription_status = ${dbStatus},
            subscription_expiry = ${expiryDate || null},
            mp_preapproval_id = ${dataId}
        WHERE id = ${userId}
      `;
    }

    if (type === "payment" && dataId) {
      const payment = await MercadoPagoService.getPayment(dataId);
      const orderId = payment.external_reference;
      const paymentStatus = mapPaymentStatus(payment.status);

      if (orderId) {
        const currentOrders = await sql`
          SELECT product_id, quantity, product_type, payment_status
          FROM product_orders
          WHERE id = ${orderId}
          LIMIT 1
        `;

        if (currentOrders.length > 0) {
          const order = currentOrders[0];
          const isPhysical = order.product_type !== "Digital";
          const fulfillmentStatus = paymentStatus === "APPROVED"
            ? isPhysical ? "PAID" : "DELIVERED"
            : "PENDING";

          await sql`
            UPDATE product_orders
            SET payment_status = ${paymentStatus},
                fulfillment_status = ${fulfillmentStatus},
                mp_payment_id = ${String(payment.id)},
                mp_status_detail = ${payment.status_detail || null},
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${orderId}
          `;

          if (paymentStatus === "APPROVED" && order.payment_status !== "APPROVED" && isPhysical && order.product_id) {
            await sql`
              UPDATE products
              SET stock = GREATEST(stock - ${Number(order.quantity || 1)}, 0)
              WHERE id = ${order.product_id}
            `;
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ message: "Webhook processing failed" }, { status: 500 });
  }
}
