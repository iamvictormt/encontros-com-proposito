import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/auth-utils";
import { MercadoPagoService } from "@/lib/mercado-pago";
import { sql } from "@/lib/db";
import { parseMercadoPagoError, getFriendlyPaymentErrorMessage } from "@/lib/payments";



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

    // Get user email
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

    if (cardTokenId) {
      try {
        const planData = await MercadoPagoService.getPlanFromDb(planType);
        const amount = planData.amount;
        const productName = `${planData.name} (1º Mês)`;

        // 1. Resolve customer ID
        const customerId = await MercadoPagoService.getOrCreateCustomer(userEmail);

        // 2. Charge the first month immediately using the card token
        const payment = await MercadoPagoService.createOrderPayment({
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
          firstName: payer?.first_name || userResults[0].full_name?.split(" ")[0] || null,
          lastName: payer?.last_name || userResults[0].full_name?.split(" ").slice(1).join(" ") || null,
          deviceId,
          quantity: 1,
          categoryId: "services",
          registrationDate: userResults[0].created_at ? new Date(userResults[0].created_at).toISOString() : null,
        });

        // Check order status
        const orderStatus = payment.status; // "processed", "created", "pending", etc.
        const paymentStatus = payment.transactions?.payments?.[0]?.status; // "processed", "declined", etc.
        const paymentStatusDetail = payment.transactions?.payments?.[0]?.status_detail;

        if (paymentStatus !== "processed" && paymentStatus !== "approved") {
          console.warn(
            `[MP] Subscription payment rejected. Order Status: ${orderStatus}, Payment Status: ${paymentStatus}, Detail: ${paymentStatusDetail}`,
          );
          const friendlyMessage = getFriendlyPaymentErrorMessage(paymentStatusDetail || "");
          return NextResponse.json(
            {
              message: friendlyMessage,
              status: paymentStatus,
              status_detail: paymentStatusDetail,
            },
            { status: 402 },
          );
        }

        // Extract card ID from Orders API response
        let cardId: string | undefined;

        // Try to get card ID from the transaction's payment method
        if (payment.transactions?.payments?.[0]?.payment_method?.id) {
          cardId = payment.transactions.payments[0].payment_method.id;
          console.log(`[MP Orders] Card ID from payment_method.id: ${cardId}`);
        }

        // Fallback: use the payment ID if card ID is not available
        if (!cardId && payment.transactions?.payments?.[0]?.id) {
          cardId = payment.transactions.payments[0].id;
          console.log(`[MP Orders] Using payment ID as card reference: ${cardId}`);
        }

        // Last fallback: use order ID
        if (!cardId && payment.id) {
          cardId = payment.id;
          console.log(`[MP Orders] Using order ID as card reference: ${cardId}`);
        }

        if (!cardId) {
          console.error(
            "[MP Orders] Failed to extract card reference from order response:",
            JSON.stringify(
              {
                orderId: payment.id,
                orderStatus: payment.status,
                paymentId: payment.transactions?.payments?.[0]?.id,
                paymentStatus: payment.transactions?.payments?.[0]?.status,
              },
              null,
              2,
            ),
          );
          throw new Error(
            "Não foi possível salvar o cartão para as cobranças recorrentes futuras.",
          );
        }

        console.log(`[MP Orders] First payment processed successfully. Card reference: ${cardId}`);

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

        if (!subscription) {
          throw new Error("Não foi possível criar a assinatura para os meses seguintes.");
        }

        if (subscription.status !== "authorized") {
          return NextResponse.json(
            {
              message: "A assinatura não pôde ser autorizada para os meses seguintes.",
              status: subscription.status,
            },
            { status: 402 },
          );
        }

        const subscriptionStatus = paymentStatus === "processed" ? "active" : "pending";
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

    const subscription = {
      ...(await MercadoPagoService.createSubscription(payload.userId, userEmail, planType)),
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
    return NextResponse.json(
      { message: error.message || "Erro ao criar assinatura" },
      { status: 500 },
    );
  }
}
