import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
dotenv.config();

async function check() {
  const sql = neon(process.env.DATABASE_URL!);
  const count = await sql`SELECT COUNT(*) FROM physical_card_requests`;
  console.log('Requests count:', count[0].count);
  
  const sample = await sql`SELECT * FROM physical_card_requests LIMIT 5`;
  console.log('Sample requests:', JSON.stringify(sample, null, 2));

  const cards = await sql`SELECT id FROM cards LIMIT 1`;
  console.log('Sample card ID:', cards[0]?.id);
}

check();
