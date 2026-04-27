import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/auth-utils";
import { getCardByToken, getCardByActivationCode, activateCard } from "@/lib/card-utils";

export async function POST(request: Request) {
  const session = await getUserSession();
  
  if (!session) {
    return NextResponse.json({ error: "Você precisa estar logado" }, { status: 401 });
  }

  const { code, name, birthDate } = await request.json();

  if (!code || !name || !birthDate) {
    return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
  }

  const card = (await getCardByToken(code)) || (await getCardByActivationCode(code));

  if (!card) {
    return NextResponse.json({ error: "Cartão não encontrado" }, { status: 404 });
  }

  if (card.status !== "INATIVO") {
    return NextResponse.json({ error: "Este cartão já está ativo" }, { status: 400 });
  }

  try {
    await activateCard(card.id, session.userId, name, birthDate);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro na ativação:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
