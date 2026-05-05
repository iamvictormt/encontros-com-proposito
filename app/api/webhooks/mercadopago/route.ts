import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { MercadoPagoService } from "@/lib/mercado-pago";

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

      // Update user status
      await sql`
        UPDATE users 
        SET subscription_status = ${dbStatus},
            subscription_expiry = ${subscription.next_payment_date || null}
        WHERE id = ${userId}
      `;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ message: "Webhook processing failed" }, { status: 500 });
  }
}
