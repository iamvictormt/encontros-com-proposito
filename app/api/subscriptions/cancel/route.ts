import { NextResponse } from "next/server";
import { verifyJWT } from "@/lib/auth-utils";
import { sql } from "@/lib/db";
import { MercadoPagoService } from "@/lib/mercado-pago";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return NextResponse.json({ message: "Token inválido" }, { status: 401 });
    }

    // Buscar o ID da assinatura do usuário no banco
    const userResults = await sql`
      SELECT mp_preapproval_id FROM users WHERE id = ${payload.userId}
    `;

    if (userResults.length === 0 || !userResults[0].mp_preapproval_id) {
      return NextResponse.json({ message: "Assinatura não encontrada" }, { status: 404 });
    }

    const preapprovalId = userResults[0].mp_preapproval_id;

    // Cancelar no Mercado Pago
    await MercadoPagoService.cancelSubscription(preapprovalId);

    // O status no banco será atualizado pelo Webhook assim que o MP processar o cancelamento,
    // mas podemos atualizar proativamente para dar feedback rápido.
    await sql`
      UPDATE users 
      SET subscription_status = 'canceled'
      WHERE id = ${payload.userId}
    `;

    return NextResponse.json({ success: true, message: "Assinatura cancelada com sucesso" });

  } catch (error) {
    console.error("Error cancelling subscription:", error);
    return NextResponse.json({ message: "Erro ao cancelar assinatura" }, { status: 500 });
  }
}
