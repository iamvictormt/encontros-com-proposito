import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
dotenv.config();

async function check() {
  const sql = neon(process.env.DATABASE_URL!);
  const cardId = '365b406b-8bd8-456b-86bf-764a3e581261';
  const card = await sql`SELECT * FROM cards WHERE id = ${cardId}`;
  console.log('Card exists:', card.length > 0);
  if (card.length > 0) {
    console.log('Card details:', JSON.stringify(card[0], null, 2));
  }
}

check();
