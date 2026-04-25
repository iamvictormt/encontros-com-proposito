import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function createAdmin() {
  const sql = neon(process.env.DATABASE_URL!);
  
  const email = 'admin@meetoff.com';
  const password = 'adminpassword';
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    // Try to find user by email first
    const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
    
    if (existing.length > 0) {
      await sql`
        UPDATE users 
        SET is_admin = true, password_hash = ${hashedPassword}
        WHERE email = ${email};
      `;
      console.log('Existing user updated to admin');
    } else {
      await sql`
        INSERT INTO users (full_name, email, cpf, password_hash, is_admin)
        VALUES ('Admin User', ${email}, '12345678901', ${hashedPassword}, true)
      `;
      console.log('New admin user created');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

createAdmin();
