import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function migrate() {
  const sql = neon(process.env.DATABASE_URL!);
  try {
    console.log("Adding latitude, longitude and cep to venues...");
    await sql`ALTER TABLE venues ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION`;
    await sql`ALTER TABLE venues ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION`;
    await sql`ALTER TABLE venues ADD COLUMN IF NOT EXISTS cep VARCHAR(10)`;
    console.log("Migration completed successfully.");
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

migrate();
