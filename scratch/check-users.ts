
import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config();

const sql = neon(process.env.DATABASE_URL!);

async function checkUser() {
  const result = await sql`
    SELECT id, email, subscription_status, subscription_expiry 
    FROM users 
    ORDER BY id DESC LIMIT 5
  `;
  
  console.log("Usuarios recentes:", result);
}

checkUser().catch(console.error);
