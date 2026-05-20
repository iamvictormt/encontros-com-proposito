import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });

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
        phone TEXT UNIQUE,
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
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT UNIQUE`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS birth_date DATE`;
    await sql`ALTER TABLE users DROP COLUMN IF EXISTS cpf`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar TEXT`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_password_token TEXT`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_password_expires TIMESTAMP WITH TIME ZONE`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive'`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_plan TEXT`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_expiry TIMESTAMP WITH TIME ZONE`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS mp_preapproval_id TEXT`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS mp_subscription_payment_id TEXT`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS mp_subscription_status_detail TEXT`;
    
    // New fields for MeetOff Brasil Permissions Flow
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS user_category TEXT DEFAULT 'COMUM'`; // 'COMUM', 'EMPRESA', 'PARCEIRO'
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'PENDENTE'`; // 'PENDENTE', 'EM_ANALISE', 'APROVADO', 'RECUSADO'
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_notes TEXT`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS document_type TEXT`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS document_url TEXT`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS selfie_url TEXT`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS cnpj TEXT`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS company_docs_url TEXT`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS legal_representative TEXT`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS background_check_status TEXT`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS partner_docs_url TEXT`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS city TEXT`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS category_of_interest JSONB DEFAULT '[]'`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS has_premium_accessory BOOLEAN DEFAULT FALSE`;

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
    await sql`ALTER TABLE events ADD COLUMN IF NOT EXISTS associated_brands JSONB DEFAULT '[]'`;

    // Brands table
    await sql`
      CREATE TABLE IF NOT EXISTS brands (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        logo TEXT NOT NULL,
        description TEXT,
        website_url TEXT,
        instagram_url TEXT,
        status TEXT DEFAULT 'Ativo',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    await sql`ALTER TABLE brands ADD COLUMN IF NOT EXISTS website_url TEXT`;
    await sql`ALTER TABLE brands ADD COLUMN IF NOT EXISTS instagram_url TEXT`;
    await sql`ALTER TABLE brands ADD COLUMN IF NOT EXISTS description TEXT`;
    await sql`ALTER TABLE brands ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Ativo'`;
    await sql`ALTER TABLE brands ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`;

    // Products table
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        image TEXT,
        images TEXT,
        stock INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS images TEXT`;
    await sql`ALTER TABLE products DROP COLUMN IF EXISTS brand_id`;

    // Product Orders table
    await sql`
      CREATE TABLE IF NOT EXISTS product_orders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        product_id UUID REFERENCES products(id) ON DELETE SET NULL,
        product_name TEXT NOT NULL,
        product_image TEXT,
        quantity INTEGER NOT NULL DEFAULT 1,
        unit_price DECIMAL(10, 2) NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        selected_size TEXT,
        product_type TEXT,
        customer_name TEXT,
        customer_email TEXT,
        delivery_method TEXT DEFAULT 'DIGITAL',
        address_cep TEXT,
        address_state TEXT,
        address_city TEXT,
        address_neighborhood TEXT,
        address_street TEXT,
        address_number TEXT,
        address_complement TEXT,
        payment_status TEXT DEFAULT 'PENDING',
        fulfillment_status TEXT DEFAULT 'PENDING',
        mp_payment_id TEXT,
        mp_status_detail TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Participations table (Event joining)
    await sql`
      CREATE TABLE IF NOT EXISTS participations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        event_id UUID REFERENCES events(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        optional_products JSONB DEFAULT '[]',
        joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(event_id, user_id)
      );
    `;
    
    await sql`ALTER TABLE participations ADD COLUMN IF NOT EXISTS optional_products JSONB DEFAULT '[]'`;

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

    // Physical Card Requests table
    await sql`
      CREATE TABLE IF NOT EXISTS physical_card_requests (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
        full_name TEXT NOT NULL,
        cep TEXT NOT NULL,
        address TEXT NOT NULL,
        number TEXT NOT NULL,
        complement TEXT,
        neighborhood TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        status TEXT DEFAULT 'PENDENTE', -- 'PENDENTE', 'PAGO', 'ENVIADO', 'CANCELADO'
        amount DECIMAL(10, 2) DEFAULT 50.00,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Premium Accessory Orders table
    await sql`
      CREATE TABLE IF NOT EXISTS premium_accessory_orders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        accessory_type TEXT NOT NULL,
        accessory_model TEXT,
        delivery_method TEXT NOT NULL,
        address_cep TEXT,
        address_state TEXT,
        address_city TEXT,
        address_neighborhood TEXT,
        address_street TEXT,
        address_number TEXT,
        address_complement TEXT,
        status TEXT DEFAULT 'PENDING', -- 'PENDING', 'SENT', 'DELIVERED', 'READY_FOR_PICKUP', 'PICKED_UP'
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Subscription Plans table
    await sql`
      CREATE TABLE IF NOT EXISTS subscription_plans (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        amount DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Seed default plans if not already present
    await sql`
      INSERT INTO subscription_plans (id, name, description, amount)
      VALUES 
        ('USER', 'MeetOff Usuários', 'Relacionamentos-Namoros-Encontros-Compromisso Sério;Participar de diversos grupo de whatsapp;Familias-Casais-Amizades;Cartão de membro virtual;Networking e Negócios;Acesso à lista de eventos online e presenciais;Parceiros de viagens-atividades;Produtos autorais exclusivos', 170.30),
        ('PARTNER', 'MeetOff Empresas/Parceiros', 'Ponto de encontro;Ponto de referência;Administradores-de-comunidades-grupos-anfitriões-cupidos-afiliados;Cartões físicos para identificação de membros nos eventos;Empreendedor-empresários-influencers-criador de conteúdos;Criar eventos-passeios-viagens-excursões etc.;Placa de identificação para localização de membros;Profissionais certificados', 232.70)
      ON CONFLICT (id) DO UPDATE 
      SET name = EXCLUDED.name,
          description = EXCLUDED.description,
          amount = EXCLUDED.amount;
    `;

    console.log('Database setup completed successfully.');
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

setupDatabase();
