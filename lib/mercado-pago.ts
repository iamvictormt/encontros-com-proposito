import { MercadoPagoConfig, PreApproval } from "mercadopago";

if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
  console.warn("MERCADOPAGO_ACCESS_TOKEN is not defined in .env");
}

export const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || "TEST-PLACEHOLDER",
});

const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === "true";

export const SUBSCRIPTION_PLANS: Record<string, { name: string, amount: number, description: string, planId?: string }> = {
  USER: {
    name: "MeetOff Usuários",
    amount: isTestMode ? 1.0 : 170.3,
    description: "Assinatura Mensal MeetOff para Usuários",
    planId: "69ce9463cda24799b9c5a3b613001df0" // ID do plano criado no painel
  },
  PARTNER: {
    name: "MeetOff Empresas/Parceiros",
    amount: isTestMode ? 1.0 : 232.7,
    description: "Assinatura Mensal MeetOff para Empresas e Parceiros",
  },
};

export class MercadoPagoService {
  /**
   * Create a pre-approval (subscription)
   * IMPORTANT: The seller email cannot be the same as the payer email.
   * If testing with your own account, use a different email in the checkout.
   */
  static async createSubscription(userId: string, userEmail: string, planType: 'USER' | 'PARTNER') {
    const planData = SUBSCRIPTION_PLANS[planType];
    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://meet-off.vercel.app").replace(/\/$/, "");

    try {
      const body: any = {
        reason: planData.name,
        payer_email: userEmail.trim().toLowerCase(),
        back_url: `${baseUrl}/account`,
        external_reference: userId,
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: planData.amount,
          currency_id: "BRL",
        }
      };

      console.log("FINAL SUBMISSION BODY:", JSON.stringify(body, null, 2));

      // Usando fetch direto para maior controle e estabilidade com a API do Mercado Pago
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
        
        // Mercado Pago often returns a generic 500 error when you try to test
        // a checkout using the same email as the Mercado Pago seller account.
        if (response.status === 500 && data.message === "Internal server error") {
          errorMessage = "Erro interno do MP (500). Isso geralmente ocorre se você usar o email da sua conta Mercado Pago no checkout. Tente com um email diferente (ex: teste@gmail.com).";
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
