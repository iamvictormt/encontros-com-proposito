import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/auth-utils";
import { MercadoPagoService } from "@/lib/mercado-pago";
import { sql } from "@/lib/db";

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

    const { planType, cardTokenId, paymentMethodId } = await request.json();
    
    if (!planType || (planType !== "USER" && planType !== "PARTNER")) {
      return NextResponse.json({ message: "Plano inválido" }, { status: 400 });
    }

    // Get user email
    const userResults = await sql`
      SELECT email, has_premium_accessory
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

    if (cardTokenId) {
      try {
        const planData = await MercadoPagoService.getPlanFromDb(planType);
        const amount = planData.amount;
        const productName = `${planData.name} (1º Mês)`;

        // 1. Charge the first month immediately using the card token
        const payment = await MercadoPagoService.createProductPayment({
          orderId: `sub-${payload.userId}-${Date.now()}`,
          productName,
          amount,
          userEmail,
          cardTokenId,
          paymentMethodId: paymentMethodId || "credit_card",
        });

        if (payment.status !== "approved") {
          return NextResponse.json(
            { 
              message: "Pagamento da assinatura recusado. Verifique os dados do cartão, limite e tente novamente.",
              status: payment.status 
            }, 
            { status: 402 }
          );
        }

        // 2. Schedule subscription auto-recurring to start in 30 days
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + 30);

        const subscription = await MercadoPagoService.createTransparentSubscription({
          userId: payload.userId,
          userEmail,
          planType,
          cardTokenId,
          startDate: startDate.toISOString(),
        });

        if (subscription.status !== "authorized") {
          return NextResponse.json(
            { 
              message: "Assinatura criada mas não pôde ser autorizada para os próximos meses.",
              status: subscription.status 
            }, 
            { status: 402 }
          );
        }

        const subscriptionStatus = "active";

        // Update user with active subscription
        await sql`
          UPDATE users 
          SET subscription_plan = ${planType}, 
              subscription_status = ${subscriptionStatus},
              mp_preapproval_id = ${subscription.id}
          WHERE id = ${payload.userId}
        `;

        return NextResponse.json({ 
          id: subscription.id,
          status: subscriptionStatus,
        });
      } catch (subError: any) {
        console.error("Transparent subscription error:", subError);
        return NextResponse.json(
          { message: subError.message || "Erro ao processar assinatura com o cartão." },
          { status: subError.status || 400 }
        );
      }
    }

    const subscription = {
      ...(await MercadoPagoService.createSubscription(
        payload.userId,
        userEmail,
        planType
      )),
      status: "pending",
      next_payment_date: null,
    };

    // Sempre criamos a assinatura como pendente para que o webhook do pagamento libere o acesso.
    const subscriptionStatus = "pending";

    // Update user with pending subscription
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
    return NextResponse.json({ message: error.message || "Erro ao criar assinatura" }, { status: 500 });
  }
}
