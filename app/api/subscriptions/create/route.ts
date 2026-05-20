import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/auth-utils";
import { MercadoPagoService } from "@/lib/mercado-pago";
import { sql } from "@/lib/db";

function getFriendlyStatusDetailMessage(detail: string): string {
  switch (detail) {
    case "cc_rejected_bad_filled_card_number":
      return "Número do cartão inválido.";
    case "cc_rejected_bad_filled_date":
      return "Data de vencimento incorreta.";
    case "cc_rejected_bad_filled_other":
      return "Dados do cartão incorretos.";
    case "cc_rejected_bad_filled_security_code":
      return "Código de segurança (CVV) incorreto.";
    case "cc_rejected_blacklist":
      return "Cartão bloqueado para esta transação.";
    case "cc_rejected_call_for_authorize":
      return "Transação não autorizada. Entre em contato com o banco emissor do cartão para liberar.";
    case "cc_rejected_card_disabled":
      return "O cartão está desabilitado. Entre em contato com seu banco.";
    case "cc_rejected_card_error":
      return "Erro ao processar o cartão. Tente novamente ou use outro cartão.";
    case "cc_rejected_duplicated_payment":
      return "Pagamento duplicado. Aguarde alguns instantes.";
    case "cc_rejected_high_risk":
      return "Transação recusada por políticas de segurança (análise de risco). Use outro cartão ou tente mais tarde.";
    case "cc_rejected_insufficient_amount":
      return "Saldo ou limite insuficiente no cartão.";
    case "cc_rejected_invalid_installments":
      return "O número de parcelas selecionado é inválido para este cartão.";
    case "cc_rejected_max_attempts":
      return "Limite de tentativas excedido. Tente novamente mais tarde.";
    default:
      return "Pagamento recusado. Verifique os dados do cartão, limite e tente novamente.";
  }
}

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

    const { 
      planType, 
      cardTokenId, 
      paymentMethodId,
      issuerId,
      installments,
      payer
    } = await request.json();
    
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

        // 1. Resolve customer ID
        const customerId = await MercadoPagoService.getOrCreateCustomer(userEmail);

        // 2. Charge the first month immediately using the card token
        const payment = await MercadoPagoService.createProductPayment({
          orderId: `sub-${payload.userId}-${Date.now()}`,
          productName,
          amount,
          userEmail: payer?.email || userEmail,
          cardTokenId,
          paymentMethodId: paymentMethodId || "credit_card",
          issuerId,
          installments,
          identificationType: payer?.identification?.type,
          identificationNumber: payer?.identification?.number,
          customerId,
        });

        const paymentStatus = payment.status; // "approved" or "in_process"

        if (paymentStatus !== "approved" && paymentStatus !== "in_process") {
          console.warn(`[MP] Subscription payment rejected. Status: ${paymentStatus}, Detail: ${payment.status_detail}`);
          const friendlyMessage = getFriendlyStatusDetailMessage(payment.status_detail || "");
          return NextResponse.json(
            { 
              message: friendlyMessage,
              status: payment.status,
              status_detail: payment.status_detail
            }, 
            { status: 402 }
          );
        }

        const cardId = payment.card?.id;
        console.log(`[MP] First payment processed successfully (${paymentStatus}). Saved card ID: ${cardId}`);

        if (!cardId) {
          throw new Error("Não foi possível salvar o cartão para as cobranças recorrentes futuras.");
        }

        // 3. Create the subscription preapproval for future cycles starting in 30 days
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + 30);

        const endDate = new Date();
        endDate.setFullYear(endDate.getFullYear() + 50); // 50 years plan validity

        const subscription = await MercadoPagoService.createTransparentSubscription({
          userId: payload.userId,
          userEmail,
          planType,
          cardId,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        });

        if (subscription.status !== "authorized") {
          return NextResponse.json(
            { 
              message: "A assinatura não pôde ser autorizada para os meses seguintes.",
              status: subscription.status 
            }, 
            { status: 402 }
          );
        }

        const subscriptionStatus = paymentStatus === "approved" ? "active" : "pending";
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);

        // Update user with subscription details
        await sql`
          UPDATE users 
          SET subscription_plan = ${planType}, 
              subscription_status = ${subscriptionStatus},
              subscription_expiry = ${expiryDate.toISOString()},
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
          { 
            message: subError.message || "Erro ao processar assinatura com o cartão.",
            details: subError.details || null
          },
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
