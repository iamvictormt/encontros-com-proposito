import { NextResponse } from "next/server";
import { getCardByToken, getCardByActivationCode } from "@/lib/card-utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Código não fornecido" }, { status: 400 });
  }

  // Check both token and activation code
  const card = (await getCardByToken(code)) || (await getCardByActivationCode(code));

  if (!card) {
    return NextResponse.json({ error: "Cartão não encontrado" }, { status: 404 });
  }

  if (card.status !== "INATIVO") {
    return NextResponse.json({ error: "Este cartão já está ativo" }, { status: 400 });
  }

  return NextResponse.json({ success: true, type: card.type });
}
