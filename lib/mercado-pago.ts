import { MercadoPagoConfig, PreApproval } from "mercadopago";

if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
  console.warn("MERCADOPAGO_ACCESS_TOKEN is not defined in .env");
}

export const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || "TEST-PLACEHOLDER",
});

const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === "true";

export const SUBSCRIPTION_PLANS = {
  USER: {
    name: "MeetOff Usuários",
    amount: isTestMode ? 1.0 : 170.3,
    description: "Assinatura Mensal MeetOff para Usuários",
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
   */
  static async createSubscription(userId: string, userEmail: string, planType: 'USER' | 'PARTNER', cardTokenId?: string) {
    const planData = SUBSCRIPTION_PLANS[planType];
    const preApproval = new PreApproval(mpClient);

    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://meet-off.vercel.app").replace(/\/$/, "");

    try {
      const body: any = {
        reason: planData.name,
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: planData.amount,
          currency_id: "BRL",
        },
        back_url: `${baseUrl}/subscriptions`,
        payer_email: userEmail.trim().toLowerCase(),
        external_reference: userId,
        status: cardTokenId ? "authorized" : "pending",
      };

      if (cardTokenId) {
        body.card_token_id = cardTokenId;
      }

      const response = await preApproval.create({ body });

      // Priorizamos o sandbox_init_point se estivermos em modo de teste
      const res = response as any;
      const initPoint = (process.env.MERCADOPAGO_ACCESS_TOKEN?.startsWith("TEST-") && res.sandbox_init_point)
        ? res.sandbox_init_point
        : res.init_point;

      return {
        init_point: initPoint,
        id: response.id
      };
    } catch (error: any) {
      console.error("Error creating MP subscription:", {
        message: error.message,
        status: error.status,
        cause: error.cause,
        stack: error.stack
      });
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
