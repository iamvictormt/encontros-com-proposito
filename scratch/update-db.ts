import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function updateDb() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not defined');
    return;
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS has_premium_accessory BOOLEAN DEFAULT FALSE`;
    console.log('Added has_premium_accessory column to users table');
  } catch (error) {
    console.error('Error:', error);
  }
}

updateDb();
