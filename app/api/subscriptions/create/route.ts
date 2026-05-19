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

    const { planType, cardTokenId } = await request.json();
    
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
