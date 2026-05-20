import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/auth-utils";
import { MercadoPagoService } from "@/lib/mercado-pago";
import { sql } from "@/lib/db";
import { parseMercadoPagoError } from "@/lib/payments";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return NextResponse.json({ message: "Token inválido" }, { status: 401 });
    }

    const { planType, cardTokenId, paymentMethodId, issuerId, installments, payer, deviceId } =
      await request.json();

    if (!planType || (planType !== "USER" && planType !== "PARTNER")) {
      return NextResponse.json({ message: "Plano inválido" }, { status: 400 });
    }

    // Get user data
    const userResults = await sql`
      SELECT email, has_premium_accessory, full_name, created_at
      FROM users
      WHERE id = ${payload.userId}
    `;
    if (userResults.length === 0) {
      return NextResponse.json({ message: "Usuário não encontrado" }, { status: 404 });
    }
    if (userResults[0].has_premium_accessory) {
      return NextResponse.json(
        { message: "Seu acesso premium ja esta liberado. Assinatura nao e necessaria." },
        { status: 400 },
      );
    }
    const userEmail = userResults[0].email;

    // --- Transparent checkout flow (card token provided) ---
    // According to MP docs, the correct approach is to create a preapproval with
    // card_token_id and status "authorized". MP validates the card, charges the
    // first installment automatically (~1 hour), and manages all future recurrences.
    if (cardTokenId) {
      try {
        const subscription = await MercadoPagoService.createTransparentSubscription({
          userId: payload.userId,
          userEmail,
          planType,
          cardTokenId,
          deviceId,
        });

        if (!subscription) {
          throw new Error("Não foi possível criar a assinatura.");
        }

        if (subscription.status !== "authorized") {
          return NextResponse.json(
            {
              message: "A assinatura não pôde ser autorizada. Verifique os dados do cartão.",
              status: subscription.status,
            },
            { status: 402 },
          );
        }

        // Subscription authorized — MP will charge the first installment in ~1 hour
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);

        await sql`
          UPDATE users 
          SET subscription_plan = ${planType}, 
              subscription_status = 'active',
              subscription_expiry = ${expiryDate.toISOString()},
              mp_preapproval_id = ${subscription.id}
          WHERE id = ${payload.userId}
        `;

        return NextResponse.json({
          id: subscription.id,
          status: "active",
        });
      } catch (subError: any) {
        console.error("Transparent subscription error:", subError);
        const parsedError = parseMercadoPagoError(subError);
        return NextResponse.json(
          {
            message: parsedError.message,
            status: parsedError.status_detail || "error",
            details: subError.details || null,
          },
          { status: parsedError.status },
        );
      }
    }

    // --- Redirect flow (no card token) ---
    // Creates a preapproval with pending status and returns init_point for the user
    // to complete payment on Mercado Pago's page.
    const subscription = {
      ...(await MercadoPagoService.createSubscription(payload.userId, userEmail, planType)),
      status: "pending",
      next_payment_date: null,
    };

    const subscriptionStatus = "pending";

    await sql`
      UPDATE users 
      SET subscription_plan = ${planType}, 
          subscription_status = ${subscriptionStatus},
          mp_preapproval_id = ${subscription.id}
      WHERE id = ${payload.userId}
    `;

    return NextResponse.json({
      init_point: subscription.init_point,
      id: subscription.id,
      status: subscriptionStatus,
    });
  } catch (error: any) {
    console.error("Subscription creation error:", error);
    return NextResponse.json(
      { message: error.message || "Erro ao criar assinatura" },
      { status: 500 },
    );
  }
}
