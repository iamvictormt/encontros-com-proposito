import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sql } from "@/lib/db";
import { verifyJWT } from "@/lib/auth-utils";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    if (!payload || !payload.isAdmin) {
      return NextResponse.json({ message: "Acesso negado" }, { status: 403 });
    }

    const { status, notes } = await request.json();
    const validStatuses = ['PENDENTE', 'EM_ANALISE', 'AGUARDANDO_REUNIAO', 'APROVADO', 'RECUSADO'];
    
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ message: "Status inválido" }, { status: 400 });
    }

    await sql`
      UPDATE users 
      SET verification_status = ${status}, verification_notes = ${notes || null}
      WHERE id = ${resolvedParams.id}
    `;

    return NextResponse.json({ message: "Status atualizado com sucesso" });
  } catch (error) {
    console.error("Admin verification update error:", error);
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}
