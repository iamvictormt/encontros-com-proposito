import { MercadoPagoConfig, PreApproval, PreApprovalPlan } from "mercadopago";

if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
  console.warn("MERCADOPAGO_ACCESS_TOKEN is not defined in .env");
}

export const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || "TEST-PLACEHOLDER",
});

export const SUBSCRIPTION_PLANS = {
  USER: {
    id: "user_monthly",
    name: "MeetOff Usuários",
    amount: 170.30,
    description: "Assinatura Mensal MeetOff para Usuários",
  },
  PARTNER: {
    id: "partner_monthly",
    name: "MeetOff Empresas/Parceiros",
    amount: 232.70,
    description: "Assinatura Mensal MeetOff para Empresas e Parceiros",
  },
};

export class MercadoPagoService {
  /**
   * Create a pre-approval (subscription)
   */
  static async createSubscription(userId: string, userEmail: string, planType: 'USER' | 'PARTNER') {
    const plan = SUBSCRIPTION_PLANS[planType];
    const preApproval = new PreApproval(mpClient);

    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://meet-off.vercel.app").replace(/\/$/, "");
    
    const body = {
      back_url: `${baseUrl}/subscriptions`,
      reason: plan.name,
      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: plan.amount,
        currency_id: "BRL",
      },
      payer_email: userEmail,
      external_reference: userId,
      status: "pending",
    };

    try {
      const response = await preApproval.create({ body });
      return response;
    } catch (error) {
      console.error("Error creating MP subscription:", error);
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
}
