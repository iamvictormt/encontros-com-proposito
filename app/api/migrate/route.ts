import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    // Add images column as TEXT (to store JSON array)
    await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS images TEXT`;
    return NextResponse.json({ message: "Migration successful" });
  } catch (error) {
    return NextResponse.json({ message: "Migration failed", error: (error as Error).message }, { status: 500 });
  }
}
