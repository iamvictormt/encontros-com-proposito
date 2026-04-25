import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyJWT } from "@/lib/auth-utils";
import { cookies } from "next/headers";

export async function GET() {
  const token = (await cookies()).get("auth_token")?.value;
  const payload = token ? await verifyJWT(token) : null;

  if (!payload || !payload.isAdmin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const totalEvents = await sql`SELECT COUNT(*) FROM events`;
    const activeEvents = await sql`SELECT COUNT(*) FROM events WHERE status = 'Ativo'`;
    const totalParticipants = await sql`SELECT COUNT(*) FROM participations`;
    const totalVenues = await sql`SELECT COUNT(*) FROM venues`;
    const totalProducts = await sql`SELECT COUNT(*) FROM products`;

    // Monthly participation data for charts
    const monthlyData = await sql`
      SELECT 
        TO_CHAR(created_at, 'Mon') as month,
        COUNT(*) as participants
      FROM participations
      GROUP BY month, TO_CHAR(created_at, 'MM')
      ORDER BY TO_CHAR(created_at, 'MM')
    `;

    return NextResponse.json({
      stats: [
        { label: "Total Eventos", value: totalEvents[0].count },
        { label: "Eventos Ativos", value: activeEvents[0].count },
        { label: "Participantes Totais", value: totalParticipants[0].count },
        { label: "Locais Cadastrados", value: totalVenues[0].count },
        { label: "Produtos na Loja", value: totalProducts[0].count },
      ],
      chartData: monthlyData,
    });
  } catch (error) {
    console.error("Reports error:", error);
    return NextResponse.json({ message: "Error fetching reports" }, { status: 500 });
  }
}
