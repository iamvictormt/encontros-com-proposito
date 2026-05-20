import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const plans = await sql`
      SELECT id, name, description, amount
      FROM subscription_plans
      ORDER BY amount ASC
    `;
    return NextResponse.json(plans);
  } catch (error) {
    console.error("Failed to fetch subscription plans:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
