
import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config();

const sql = neon(process.env.DATABASE_URL!);

async function fixUser() {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 30);
  
  const result = await sql`
    UPDATE users 
    SET subscription_expiry = ${expiry.toISOString()}
    WHERE subscription_status = 'canceled' AND subscription_expiry IS NULL
    RETURNING id, email, subscription_expiry
  `;
  
  console.log("Usuarios corrigidos:", result);
}

fixUser().catch(console.error);
