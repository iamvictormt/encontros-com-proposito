import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { MercadoPagoService } from "@/lib/mercado-pago";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const dataId = searchParams.get("data.id");

    console.log("Mercado Pago Webhook received:", { type, dataId });

    // Validate Signature
    const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
    const xSignature = request.headers.get("x-signature") || request.headers.get("x-cors-signature");
    const xRequestId = request.headers.get("x-request-id");

    if (secret && xSignature && xRequestId && dataId) {
      const parts = xSignature.split(",");
      let ts = "";
      let v1 = "";
      parts.forEach(part => {
        const [key, value] = part.split("=");
        if (key === "ts") ts = value;
        if (key === "v1") v1 = value;
      });

      const manifest = `id:${dataId}-request_id:${xRequestId}-ts:${ts}`;
      const hmac = crypto.createHmac("sha256", secret).update(manifest).digest("hex");
      
      if (hmac !== v1) {
        console.warn("Invalid webhook signature!");
        return NextResponse.json({ message: "Invalid signature" }, { status: 403 });
      }
    }


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
