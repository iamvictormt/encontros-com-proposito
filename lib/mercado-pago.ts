import crypto from "crypto";
import { MercadoPagoConfig, PreApproval } from "mercadopago";
import { isPaymentTestMode, resolvePayerEmail, resolvePaymentAmount } from "@/lib/payments";
import { sql } from "@/lib/db";

if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
  console.warn("MERCADOPAGO_ACCESS_TOKEN is not defined in .env");
}

if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
  console.warn("MERCADOPAGO_ACCESS_TOKEN is not defined in .env");
}

export const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || "TEST-PLACEHOLDER",
});

export const SUBSCRIPTION_PLANS: Record<
  string,
  { name: string; amount: number; description: string }
> = {
  USER: {
    name: "MeetOff Usuários",
    amount: 170.3,
    description: "Assinatura Mensal MeetOff para Usuários",
  },
  PARTNER: {
    name: "MeetOff Empresas/Parceiros",
    amount: 232.7,
    description: "Assinatura Mensal MeetOff para Empresas e Parceiros",
  },
};

export class MercadoPagoService {
  /**
   * Fetch active subscription plan details dynamically from database
   */
  static async getPlanFromDb(
    planType: "USER" | "PARTNER",
  ): Promise<{ name: string; amount: number; description: string }> {
    try {
      const planResults = await sql`
        SELECT name, description, amount
        FROM subscription_plans
        WHERE id = ${planType}
        LIMIT 1
      `;
      if (planResults.length > 0) {
        return {
          name: planResults[0].name,
          amount: resolvePaymentAmount(Number(planResults[0].amount)),
          description: planResults[0].description || "",
        };
      }
    } catch (err) {
      console.warn(
        "[MP] Failed to query subscription_plans from database, falling back to static config:",
        err,
      );
    }
    return {
      name: SUBSCRIPTION_PLANS[planType].name,
      amount: resolvePaymentAmount(SUBSCRIPTION_PLANS[planType].amount),
      description: SUBSCRIPTION_PLANS[planType].description,
    };
  }

  /**
   * Create a pre-approval (subscription) via redirect flow
   */
  static async createSubscription(userId: string, userEmail: string, planType: "USER" | "PARTNER") {
    const planData = await this.getPlanFromDb(planType);
    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://meet-off.vercel.app").replace(
      /\/$/,
      "",
    );

    try {
      const body: any = {
        reason: planData.name,
        payer_email: resolvePayerEmail(userEmail).trim().toLowerCase(),
        back_url: `${baseUrl}/conta`,
        external_reference: userId,
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: planData.amount,
          currency_id: "BRL",
        },
      };

      if (baseUrl && !baseUrl.includes("localhost") && !baseUrl.includes("127.0.0.1")) {
        body.notification_url = `${baseUrl}/api/webhooks/mercadopago`;
      }

      // Removed preapproval_plan_id assignment to force a redirect flow (dynamic subscription).
      // If we pass preapproval_plan_id, Mercado Pago expects card_token_id for transparent checkout.

      console.log("FINAL SUBMISSION BODY (REDIRECT):", JSON.stringify(body, null, 2));

      const response = await fetch("https://api.mercadopago.com/preapproval", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("MP ERROR RESPONSE:", JSON.stringify(data, null, 2));
        let errorMessage = data.message || "Erro na API do Mercado Pago";

        if (response.status === 500 && data.message === "Internal server error") {
          errorMessage =
            "Erro interno do MP (500). Isso geralmente ocorre se você usar o email da sua conta Mercado Pago no checkout.";
        }

        throw {
          message: errorMessage,
          status: response.status,
          details: data,
        };
      }

      const initPoint =
        process.env.MERCADOPAGO_ACCESS_TOKEN?.startsWith("TEST-") && data.sandbox_init_point
          ? data.sandbox_init_point
          : data.init_point;

      return {
        init_point: initPoint,
        id: data.id,
      };
    } catch (error: any) {
      console.error("Error creating subscription:", error);
      throw error;
    }
  }

  /**
   * Helper to retrieve an existing subscription plan or create one on the fly.
   * This removes the need for manual configuration of plan IDs in env.
   */
  static async getOrCreatePreapprovalPlanId(planType: "USER" | "PARTNER"): Promise<string> {
    const planData = await this.getPlanFromDb(planType);
    const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://meet-off.vercel.app").replace(
      /\/$/,
      "",
    );

    try {
      // 1. Search for existing plan
      const searchRes = await fetch(
        "https://api.mercadopago.com/preapproval_plan/search?status=active",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (searchRes.ok) {
        const searchData = await searchRes.json();
        const existingPlan = searchData.results?.find(
          (plan: any) =>
            plan.reason === planData.name &&
            Number(plan.auto_recurring?.transaction_amount) === planData.amount,
        );
        if (existingPlan) {
          console.log(
            `[MP] Found existing plan ID for ${planType} (${planData.name} - R$ ${planData.amount}): ${existingPlan.id}`,
          );
          return existingPlan.id;
        }
      }

      // 2. If not found, create a new one
      console.log(
        `[MP] Creating new preapproval plan for ${planType} (${planData.name} - R$ ${planData.amount})...`,
      );
      const createRes = await fetch("https://api.mercadopago.com/preapproval_plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reason: planData.name,
          auto_recurring: {
            frequency: 1,
            frequency_type: "months",
            transaction_amount: planData.amount,
            currency_id: "BRL",
          },
          back_url: `${baseUrl}/conta`,
        }),
      });

      const createData = await createRes.json();
      if (!createRes.ok) {
        console.error("[MP] Error creating preapproval plan:", JSON.stringify(createData, null, 2));
        throw new Error(createData.message || "Failed to create preapproval plan on Mercado Pago");
      }

      console.log(`[MP] Created new plan ID for ${planType}: ${createData.id}`);
      return createData.id;
    } catch (err) {
      console.error(`[MP] Failed to get or create plan for ${planType}:`, err);
      throw err;
    }
  }

  /**
   * Create a transparent subscription (preapproval) using a card token
   */
  static async createTransparentSubscription({
    userId,
    userEmail,
    planType,
    cardTokenId,
    cardId,
    startDate,
    endDate,
  }: {
    userId: string;
    userEmail: string;
    planType: "USER" | "PARTNER";
    cardTokenId?: string | null;
    cardId?: string | null;
    startDate?: string;
    endDate?: string;
  }) {
    try {
      const planId = await this.getOrCreatePreapprovalPlanId(planType);
      const planData = await this.getPlanFromDb(planType);
      const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://meet-off.vercel.app").replace(/\/$/, "");

      const body: any = {
        preapproval_plan_id: planId,
        payer_email: resolvePayerEmail(userEmail).trim().toLowerCase(),
        status: "authorized",
        reason: planData.name,
        external_reference: userId,
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: planData.amount,
          currency_id: "BRL",
        },
      };

      if (baseUrl && !baseUrl.includes("localhost") && !baseUrl.includes("127.0.0.1")) {
        body.notification_url = `${baseUrl}/api/webhooks/mercadopago`;
      }

      if (startDate && endDate) {
        body.auto_recurring.start_date = startDate;
        body.auto_recurring.end_date = endDate;
      }

      if (cardTokenId) {
        body.card_token_id = cardTokenId;
      } else if (cardId) {
        body.card_id = cardId;
      }

      const response = await fetch("https://api.mercadopago.com/preapproval", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("MP SUBSCRIPTION ERROR RESPONSE:", JSON.stringify(data, null, 2));
        let errorMessage = data.message || "Erro ao processar assinatura";
        if (data.cause && Array.isArray(data.cause) && data.cause.length > 0) {
          errorMessage = data.cause.map((c: any) => c.description).join(", ");
        }
        throw {
          message: errorMessage,
          status: response.status,
          details: data,
        };
      }

      return data;
    } catch (error: any) {
      console.error("Error creating transparent subscription:", error);
      throw error;
    }
  }

  /**
   * Create a payment using Mercado Pago Orders API (Checkout Transparente - Automatic Mode)
   * This is the new recommended approach for transparent checkout payments
   */
  static async createOrderPayment({
    orderId,
    productName,
    amount,
    userEmail,
    cardTokenId,
    paymentMethodId,
    issuerId,
    installments,
    identificationType,
    identificationNumber,
  }: {
    orderId: string;
    productName: string;
    amount: number;
    userEmail: string;
    cardTokenId: string;
    paymentMethodId: string;
    issuerId?: string | number | null;
    installments?: number | string | null;
    identificationType?: string | null;
    identificationNumber?: string | null;
  }) {
    const paymentAmount = resolvePaymentAmount(amount);
    const payerEmail = resolvePayerEmail(userEmail);

    // For Orders API, payment_method.id must be a specific card brand (visa, master, amex, elo, diners, hipercard)
    const allowedBrands = ["visa", "master", "amex", "elo", "diners", "hipercard"];
    const brandMap: Record<string, string> = {
      mastercard: "master",
      visa: "visa",
      master: "master",
      amex: "amex",
      elo: "elo",
      diners: "diners",
      hipercard: "hipercard",
    };

    let resolvedMethodId = paymentMethodId;

    // If paymentMethodId is generic (credit_card/debit_card) or missing, and we have cardTokenId,
    // fetch the actual card brand from Mercado Pago token endpoint
    if (
      cardTokenId &&
      (!resolvedMethodId ||
        !allowedBrands.includes(resolvedMethodId.toLowerCase()) &&
        resolvedMethodId.toLowerCase() !== "visa" &&
        resolvedMethodId.toLowerCase() !== "master")
    ) {
      try {
        console.log(`[MP Orders] Querying card token ${cardTokenId} to resolve brand...`);
        const tokenRes = await fetch(`https://api.mercadopago.com/v1/card_tokens/${cardTokenId}`, {
          headers: {
            Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
          },
        });
        if (tokenRes.ok) {
          const tokenData = await tokenRes.json();
          const tokenBrand = tokenData.payment_method?.id;
          if (tokenBrand) {
            console.log(`[MP Orders] Resolved brand from token: ${tokenBrand}`);
            resolvedMethodId = tokenBrand;
          }
        } else {
          console.error(`[MP Orders] Failed to query card token: ${tokenRes.status}`);
        }
      } catch (err) {
        console.error(`[MP Orders] Error querying card token:`, err);
      }
    }

    let mappedMethodId = "visa";
    if (resolvedMethodId) {
      const lowerId = resolvedMethodId.toLowerCase();
      mappedMethodId = brandMap[lowerId] || resolvedMethodId;
    }

    // Safety fallback: if mappedMethodId is still not in allowed brands list, default to "visa"
    if (!allowedBrands.includes(mappedMethodId.toLowerCase())) {
      console.warn(`[MP Orders] Mapped method ID "${mappedMethodId}" is not in allowed brands. Defaulting to "visa".`);
      mappedMethodId = "visa";
    }

    const paymentBody: any = {
      amount: paymentAmount.toString(),
      payment_method: {
        id: mappedMethodId,
        type: "credit_card",
        token: cardTokenId,
        installments: Math.max(1, Number(installments) || 1),
      },
    };

    // Note: issuer_id is not supported in Orders API payment_method
    // If needed, it should be handled at a different level or via additional requests

    const orderBody: any = {
      type: "online",
      processing_mode: "automatic",
      external_reference: orderId,
      total_amount: paymentAmount.toString(),
      payer: {
        email: resolvePayerEmail(userEmail).trim().toLowerCase(),
      },
      transactions: {
        payments: [paymentBody],
      },
    };

    // Add payer identification if provided
    if (identificationType && identificationNumber) {
      orderBody.payer.identification = {
        type: identificationType,
        number: identificationNumber,
      };
    }

    try {
      console.log("[MP Orders] Creating order with:", JSON.stringify(orderBody, null, 2));

      const response = await fetch("https://api.mercadopago.com/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
          "X-Idempotency-Key": crypto.randomUUID(),
        },
        body: JSON.stringify(orderBody),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("[MP Orders] Payment error response:", JSON.stringify(data, null, 2));
        let errorMessage = data.message || "Erro ao processar pagamento";

        // Orders API provides better error structure
        if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
          errorMessage = data.errors.map((e: any) => e.description || e.message).join(", ");
        } else if (data.cause && Array.isArray(data.cause) && data.cause.length > 0) {
          errorMessage = data.cause.map((c: any) => c.description).join(", ");
        }

        throw {
          message: errorMessage,
          status: response.status,
          details: data,
        };
      }

      console.log("[MP Orders] Payment successful - Order ID:", data.id, "Status:", data.status);
      console.log(
        "[MP Orders] Transaction details:",
        JSON.stringify(
          {
            orderId: data.id,
            orderStatus: data.status,
            orderStatusDetail: data.status_detail,
            paymentId: data.transactions?.payments?.[0]?.id,
            paymentStatus: data.transactions?.payments?.[0]?.status,
            paymentStatusDetail: data.transactions?.payments?.[0]?.status_detail,
            hasCard: !!data.transactions?.payments?.[0]?.payment_method?.card,
            cardLastFourDigits:
              data.transactions?.payments?.[0]?.payment_method?.card?.last_four_digits,
          },
          null,
          2,
        ),
      );

      return data;
    } catch (error: any) {
      console.error("[MP Orders] Error creating order payment:", error);
      throw error;
    }
  }

  /**
   * Process a direct card payment (Checkout Transparente - Wrapper using Orders API)
   * This is now a wrapper around createOrderPayment for backward compatibility
   */
  static async createProductPayment({
    orderId,
    productName,
    amount,
    userEmail,
    cardTokenId,
    paymentMethodId,
    issuerId,
    installments,
    identificationType,
    identificationNumber,
    customerId,
    cardId,
  }: {
    orderId: string;
    productName: string;
    amount: number;
    userEmail: string;
    cardTokenId?: string | null;
    paymentMethodId: string;
    issuerId?: string | number | null;
    installments?: number | string | null;
    identificationType?: string | null;
    identificationNumber?: string | null;
    customerId?: string | null;
    cardId?: string | null;
  }) {
    // If using card token ID, delegate to the new Orders API
    if (cardTokenId) {
      try {
        const orderResponse = await this.createOrderPayment({
          orderId,
          productName,
          amount,
          userEmail,
          cardTokenId,
          paymentMethodId,
          issuerId,
          installments,
          identificationType,
          identificationNumber,
        });

        // Adapt Orders API response to legacy format for backward compatibility
        const legacyResponse = {
          id: orderResponse.transactions?.payments?.[0]?.id || orderResponse.id,
          status:
            orderResponse.transactions?.payments?.[0]?.status === "processed"
              ? "approved"
              : orderResponse.transactions?.payments?.[0]?.status,
          status_detail: orderResponse.transactions?.payments?.[0]?.status_detail,
          transaction_amount: amount,
          payment_type_id: "credit_card",
          payment_method_id: paymentMethodId,
          card: {
            id: orderResponse.transactions?.payments?.[0]?.payment_method?.id,
            last_four_digits:
              orderResponse.transactions?.payments?.[0]?.payment_method?.card?.last_four_digits,
          },
          // Include full order response for debugging
          _order_response: orderResponse,
        };

        console.log(
          "[MP] Adapted legacy payment response:",
          JSON.stringify(
            {
              id: legacyResponse.id,
              status: legacyResponse.status,
              card_id: legacyResponse.card.id,
            },
            null,
            2,
          ),
        );

        return legacyResponse;
      } catch (error: any) {
        console.error("[MP] Error in createProductPayment wrapper:", error);
        throw error;
      }
    }

    // Fallback to legacy behavior if no card token
    const paymentAmount = resolvePaymentAmount(amount);
    const payerEmail = resolvePayerEmail(userEmail);
    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://meet-off.vercel.app").replace(/\/$/, "");

    const body: any = {
      description: productName,
      payment_method_id: paymentMethodId,
      payer: customerId
        ? {
            id: customerId,
            type: "customer",
          }
        : {
            email: payerEmail.trim().toLowerCase(),
          },
      transaction_amount: paymentAmount,
      external_reference: orderId,
    };

    if (baseUrl && !baseUrl.includes("localhost") && !baseUrl.includes("127.0.0.1")) {
      body.notification_url = `${baseUrl}/api/webhooks/mercadopago`;
    }

    if (cardId) {
      body.card = { id: cardId };
    }

    if (installments !== undefined && installments !== null) {
      body.installments = Number(installments);
    } else {
      body.installments = 1;
    }

    if (issuerId !== undefined && issuerId !== null && issuerId !== "") {
      body.issuer_id = String(issuerId);
    }

    if (!customerId && identificationType && identificationNumber) {
      body.payer.identification = {
        type: identificationType,
        number: identificationNumber,
      };
    }

    try {
      const response = await fetch("https://api.mercadopago.com/v1/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
          "X-Idempotency-Key": crypto.randomUUID(),
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("[MP] Legacy Payments API error:", JSON.stringify(data, null, 2));
        let errorMessage = data.message || "Erro ao processar pagamento";
        if (data.cause && Array.isArray(data.cause) && data.cause.length > 0) {
          errorMessage = data.cause.map((c: any) => c.description).join(", ");
        }
        throw {
          message: errorMessage,
          status: response.status,
          details: data,
        };
      }

      return data;
    } catch (error: any) {
      console.error("[MP] Error in legacy payment fallback:", error);
      throw error;
    }
  }

  static async createProductPreference({
    orderId,
    productName,
    amount,
    userEmail,
  }: {
    orderId: string;
    productName: string;
    amount: number;
    userEmail: string;
  }) {
    const paymentAmount = resolvePaymentAmount(amount);
    const payerEmail = resolvePayerEmail(userEmail);
    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://meet-off.vercel.app").replace(
      /\/$/,
      "",
    );

    const body: any = {
      items: [
        {
          id: orderId,
          title: productName,
          quantity: 1,
          unit_price: paymentAmount,
          currency_id: "BRL",
        },
      ],
      payer: {
        email: payerEmail.trim().toLowerCase(),
      },
      back_urls: {
        success: `${baseUrl}/conta?success=true`,
        failure: `${baseUrl}/conta?success=false`,
        pending: `${baseUrl}/conta?success=pending`,
      },
      auto_return: "approved",
      external_reference: orderId,
    };

    if (baseUrl && !baseUrl.includes("localhost") && !baseUrl.includes("127.0.0.1")) {
      body.notification_url = `${baseUrl}/api/webhooks/mercadopago`;
    }

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("MP PREFERENCE ERROR:", JSON.stringify(data, null, 2));
      let errorMessage = data.message || "Erro ao criar preferência de pagamento";
      throw {
        message: errorMessage,
        status: response.status,
        details: data,
      };
    }

    const initPoint =
      process.env.MERCADOPAGO_ACCESS_TOKEN?.startsWith("TEST-") && data.sandbox_init_point
        ? data.sandbox_init_point
        : data.init_point;

    return {
      init_point: initPoint,
      id: data.id,
    };
  }

  static async getPayment(paymentId: string) {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw {
        message: data.message || "Erro ao consultar pagamento",
        status: response.status,
        details: data,
      };
    }

    return data;
  }

  /**
   * Get order details (Orders API)
   */
  static async getOrder(orderId: string) {
    const response = await fetch(`https://api.mercadopago.com/v1/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw {
        message: data.message || "Erro ao consultar order",
        status: response.status,
        details: data,
      };
    }

    return data;
  }

  static async getAuthorizedPayment(authorizedPaymentId: string) {
    const response = await fetch(
      `https://api.mercadopago.com/authorized_payments/${authorizedPaymentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw {
        message: data.message || "Erro ao consultar fatura da assinatura",
        status: response.status,
        details: data,
      };
    }

    return data;
  }

  static async searchAuthorizedPaymentsByPayment(paymentId: string) {
    const params = new URLSearchParams({ payment_id: paymentId });
    const response = await fetch(
      `https://api.mercadopago.com/authorized_payments/search?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw {
        message: data.message || "Erro ao buscar fatura da assinatura pelo pagamento",
        status: response.status,
        details: data,
      };
    }

    return data.results || [];
  }

  /**
   * Get subscription details
   */
  static async getSubscription(preApprovalId: string) {
    const preApproval = new PreApproval(mpClient);
    try {
      return await preApproval.get({ id: preApprovalId });
    } catch (error) {
      console.error("Error getting MP subscription:", error);
      throw error;
    }
  }

  /**
   * Cancel subscription
   */
  static async cancelSubscription(preApprovalId: string) {
    const preApproval = new PreApproval(mpClient);
    try {
      return await preApproval.update({
        id: preApprovalId,
        body: { status: "cancelled" },
      });
    } catch (error) {
      console.error("Error cancelling MP subscription:", error);
      throw error;
    }
  }

  /**
   * Search for a customer by email or create a new one
   */
  static async getOrCreateCustomer(email: string): Promise<string> {
    const cleanEmail = resolvePayerEmail(email).trim().toLowerCase();
    try {
      // 1. Search for customer
      const searchResponse = await fetch(
        `https://api.mercadopago.com/v1/customers/search?email=${encodeURIComponent(cleanEmail)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
          },
        },
      );

      if (searchResponse.ok) {
        const searchData = await searchResponse.json();
        if (searchData.results && searchData.results.length > 0) {
          console.log(
            `[MP] Found existing customer ID: ${searchData.results[0].id} for email: ${cleanEmail}`,
          );
          return searchData.results[0].id;
        }
      }

      // 2. Create customer if not found
      console.log(`[MP] Customer not found. Creating new customer for email: ${cleanEmail}`);
      const createResponse = await fetch("https://api.mercadopago.com/v1/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const createData = await createResponse.json();
      if (!createResponse.ok) {
        console.error("[MP] Error creating customer:", JSON.stringify(createData, null, 2));
        throw new Error(createData.message || "Failed to create customer on Mercado Pago");
      }

      console.log(`[MP] Created new customer ID: ${createData.id} for email: ${cleanEmail}`);
      return createData.id;
    } catch (error) {
      console.error("[MP] getOrCreateCustomer error:", error);
      throw error;
    }
  }

  /**
   * Save a card token to a customer and return the saved card ID
   */
  static async saveCardToCustomer(customerId: string, cardTokenId: string): Promise<string> {
    try {
      const response = await fetch(`https://api.mercadopago.com/v1/customers/${customerId}/cards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({ token: cardTokenId }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error(
          `[MP] Error saving card to customer ${customerId}:`,
          JSON.stringify(data, null, 2),
        );
        throw new Error(data.message || "Failed to save card to customer");
      }

      console.log(`[MP] Saved card ID: ${data.id} to customer: ${customerId}`);
      return data.id;
    } catch (error) {
      console.error("[MP] saveCardToCustomer error:", error);
      throw error;
    }
  }
}
