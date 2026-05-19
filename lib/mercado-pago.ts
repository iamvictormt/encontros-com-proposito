import crypto from "crypto";
import { MercadoPagoConfig, PreApproval } from "mercadopago";
import { isPaymentTestMode, resolvePayerEmail, resolvePaymentAmount } from "@/lib/payments";

if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
  console.warn("MERCADOPAGO_ACCESS_TOKEN is not defined in .env");
}

if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
  console.warn("MERCADOPAGO_ACCESS_TOKEN is not defined in .env");
}

export const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || "TEST-PLACEHOLDER",
});

export const SUBSCRIPTION_PLANS: Record<string, { name: string, amount: number, description: string, planId?: string }> = {
  USER: {
    name: "MeetOff Usuários",
    amount: resolvePaymentAmount(170.3),
    description: "Assinatura Mensal MeetOff para Usuários",
    planId: process.env.MP_USER_PLAN_ID
  },
  PARTNER: {
    name: "MeetOff Empresas/Parceiros",
    amount: resolvePaymentAmount(232.7),
    description: "Assinatura Mensal MeetOff para Empresas e Parceiros",
    planId: process.env.MP_PARTNER_PLAN_ID
  },
};

export class MercadoPagoService {
  /**
   * Create a pre-approval (subscription) via redirect flow
   */
  static async createSubscription(userId: string, userEmail: string, planType: 'USER' | 'PARTNER') {
    const planData = SUBSCRIPTION_PLANS[planType];
    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://meet-off.vercel.app").replace(/\/$/, "");

    try {
      const body: any = {
        reason: planData.name,
        payer_email: userEmail.trim().toLowerCase(),
        back_url: `${baseUrl}/conta`,
        external_reference: userId,
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: planData.amount,
          currency_id: "BRL",
        }
      };

      // Removed preapproval_plan_id assignment to force a redirect flow (dynamic subscription).
      // If we pass preapproval_plan_id, Mercado Pago expects card_token_id for transparent checkout.

      console.log("FINAL SUBMISSION BODY (REDIRECT):", JSON.stringify(body, null, 2));

      const response = await fetch("https://api.mercadopago.com/preapproval", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("MP ERROR RESPONSE:", JSON.stringify(data, null, 2));
        let errorMessage = data.message || "Erro na API do Mercado Pago";
        
        if (response.status === 500 && data.message === "Internal server error") {
          errorMessage = "Erro interno do MP (500). Isso geralmente ocorre se você usar o email da sua conta Mercado Pago no checkout.";
        }

        throw {
          message: errorMessage,
          status: response.status,
          details: data
        };
      }

      const initPoint = (process.env.MERCADOPAGO_ACCESS_TOKEN?.startsWith("TEST-") && data.sandbox_init_point)
        ? data.sandbox_init_point
        : data.init_point;

      return {
        init_point: initPoint,
        id: data.id
      };
    } catch (error: any) {
      console.error("Error creating subscription:", error);
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
    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://meet-off.vercel.app").replace(/\/$/, "");

    const body: any = {
      items: [
        {
          id: orderId,
          title: productName,
          quantity: 1,
          unit_price: paymentAmount,
          currency_id: "BRL",
        }
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

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
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

    const initPoint = (process.env.MERCADOPAGO_ACCESS_TOKEN?.startsWith("TEST-") && data.sandbox_init_point)
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
        "Authorization": `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
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

  static async getAuthorizedPayment(authorizedPaymentId: string) {
    const response = await fetch(`https://api.mercadopago.com/authorized_payments/${authorizedPaymentId}`, {
      headers: {
        "Authorization": `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
      },
    });

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
    const response = await fetch(`https://api.mercadopago.com/authorized_payments/search?${params.toString()}`, {
      headers: {
        "Authorization": `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
      },
    });

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
        body: { status: "cancelled" }
      });
    } catch (error) {
      console.error("Error cancelling MP subscription:", error);
      throw error;
    }
  }
}
