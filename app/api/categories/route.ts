import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await sql`SELECT * FROM categories ORDER BY name ASC`;
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    const result = await sql`
      INSERT INTO categories (name)
      VALUES (${name})
      ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
      RETURNING *
    `;
    return NextResponse.json(result[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
