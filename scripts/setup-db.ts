import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

async function setupDatabase() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not defined');
    return;
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    console.log('Creating/Updating tables...');

    // Users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        full_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        cpf TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        is_admin BOOLEAN DEFAULT FALSE,
        role TEXT DEFAULT 'Usuário',
        avatar TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Ensure columns exist for users if table was already created
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'Usuário'`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar TEXT`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`;

    // Cards table
    await sql`
      CREATE TABLE IF NOT EXISTS cards (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        type TEXT NOT NULL, -- 'GREEN', 'PINK'
        status TEXT NOT NULL DEFAULT 'INATIVO', -- 'INATIVO', 'ATIVO', 'BLOQUEADO', 'PENDENTE'
        owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
        qr_code_token TEXT UNIQUE NOT NULL,
        activation_code TEXT UNIQUE, -- Manual code for pink cards
        name TEXT, -- Name printed/linked
        birth_date DATE,
        nfc_id TEXT,
        card_number TEXT UNIQUE,
        expiry_date TEXT,
        cvv TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`ALTER TABLE cards ADD COLUMN IF NOT EXISTS card_number TEXT UNIQUE`;
    await sql`ALTER TABLE cards ADD COLUMN IF NOT EXISTS expiry_date TEXT`;
    await sql`ALTER TABLE cards ADD COLUMN IF NOT EXISTS cvv TEXT`;

    // Venues table
    await sql`
      CREATE TABLE IF NOT EXISTS venues (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        location TEXT NOT NULL,
        type TEXT NOT NULL,
        image TEXT,
        status TEXT DEFAULT 'Ativo',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Venues table updates for Partners
    await sql`ALTER TABLE venues ADD COLUMN IF NOT EXISTS responsible_name TEXT`;
    await sql`ALTER TABLE venues ADD COLUMN IF NOT EXISTS address TEXT`;
    await sql`ALTER TABLE venues ADD COLUMN IF NOT EXISTS category TEXT`;
    await sql`ALTER TABLE venues ADD COLUMN IF NOT EXISTS contact_phone TEXT`;
    await sql`ALTER TABLE venues ADD COLUMN IF NOT EXISTS plate_status TEXT DEFAULT 'PENDING'`; // 'PENDING', 'SENT', 'ACTIVE'
    await sql`ALTER TABLE venues ADD COLUMN IF NOT EXISTS qr_code_token TEXT UNIQUE`;

    // Events table
    await sql`
      CREATE TABLE IF NOT EXISTS events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        image TEXT,
        status TEXT DEFAULT 'Ativo',
        tags TEXT[],
        date TIMESTAMP WITH TIME ZONE NOT NULL,
        time TEXT,
        location TEXT,
        address TEXT,
        price DECIMAL(10, 2) DEFAULT 0,
        description TEXT,
        capacity INTEGER DEFAULT 0,
        type_event TEXT DEFAULT 'Presencial',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    await sql`ALTER TABLE events ADD COLUMN IF NOT EXISTS capacity INTEGER DEFAULT 0`;
    await sql`ALTER TABLE events ADD COLUMN IF NOT EXISTS images TEXT`;
    await sql`ALTER TABLE events ADD COLUMN IF NOT EXISTS cep TEXT`;
    await sql`ALTER TABLE events ADD COLUMN IF NOT EXISTS target_audience TEXT`;
    await sql`ALTER TABLE events ADD COLUMN IF NOT EXISTS conductor TEXT`;
    await sql`ALTER TABLE events ADD COLUMN IF NOT EXISTS has_certificate BOOLEAN DEFAULT true`;
    await sql`ALTER TABLE events ADD COLUMN IF NOT EXISTS mandatory_products JSONB DEFAULT '[]'`;
    await sql`ALTER TABLE events ADD COLUMN IF NOT EXISTS groups JSONB DEFAULT '[]'`;
    await sql`ALTER TABLE events ADD COLUMN IF NOT EXISTS video_url TEXT`;
    await sql`ALTER TABLE events ADD COLUMN IF NOT EXISTS age_range TEXT`;
    await sql`ALTER TABLE events ADD COLUMN IF NOT EXISTS type_event TEXT DEFAULT 'Presencial'`;

    // Brands table
    await sql`
      CREATE TABLE IF NOT EXISTS brands (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        logo TEXT,
        description TEXT,
        website TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Products table
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        image TEXT,
        images TEXT,
        brand_id UUID REFERENCES brands(id),
        stock INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS images TEXT`;

    // Participations table (Event joining)
    await sql`
      CREATE TABLE IF NOT EXISTS participations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        event_id UUID REFERENCES events(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(event_id, user_id)
      );
    `;

    // Interactions table
    await sql`
      CREATE TABLE IF NOT EXISTS interactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
        interaction_type TEXT DEFAULT 'CHECK_IN',
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log('Database setup completed successfully.');
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

setupDatabase();
