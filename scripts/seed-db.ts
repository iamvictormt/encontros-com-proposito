import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function seed() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not defined');
    return;
  }

  const sql = neon(process.env.DATABASE_URL);
  const passwordHash = await bcrypt.hash('password123', 10);

  try {
    console.log('Seeding data...');

    // 1. Seed Venues
    console.log('Seeding Venues...');
    const venues = await sql`
      INSERT INTO venues (name, location, type, image, status) VALUES
      ('Teatro Municipal', 'São Paulo, SP', 'Cultural', 'https://images.unsplash.com/photo-1503095396549-807ecf501703?w=800', 'Ativo'),
      ('Centro de Convenções', 'Rio de Janeiro, RJ', 'Corporativo', 'https://images.unsplash.com/photo-1517457373958-b7bdd458ad20?w=800', 'Ativo'),
      ('Espaço Lounge Gourmet', 'Curitiba, PR', 'Gastronômico', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', 'Ativo'),
      ('Parque das Águas', 'Belo Horizonte, MG', 'Ar Livre', 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800', 'Ativo'),
      ('Auditório Tech', 'Florianópolis, SC', 'Tecnologia', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', 'Ativo')
      RETURNING id
    `;

    // 2. Seed Brands
    console.log('Seeding Brands...');
    const brands = await sql`
      INSERT INTO brands (name, logo, description, website) VALUES
      ('Tech Solutions', 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200', 'Inovação em tecnologia para o dia a dia.', 'https://techsolutions.com'),
      ('Gourmet Experiences', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200', 'Momentos únicos através da culinária.', 'https://gourmet.com'),
      ('Fashion Forward', 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=200', 'Estilo e elegância em cada detalhe.', 'https://fashion.com'),
      ('Eco Green', 'https://images.unsplash.com/photo-1542601906990-b4d3fb773b09?w=200', 'Sustentabilidade e respeito à natureza.', 'https://ecogreen.com'),
      ('Health & Wellness', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200', 'Cuidado integral com sua saúde.', 'https://health.com')
      RETURNING id
    `;

    // 3. Seed Events
    console.log('Seeding Events...');
    const eventDates = [
      '2025-06-15T19:00:00Z',
      '2025-07-20T14:00:00Z',
      '2025-08-10T09:00:00Z',
      '2025-09-05T20:00:00Z',
      '2025-10-12T18:30:00Z'
    ];

    await sql`
      INSERT INTO events (title, image, status, tags, date, time, location, address, price, description, capacity) VALUES
      ('Conferência Tech 2025', 'https://images.unsplash.com/photo-1540575861501-7c001173a270?w=800', 'Ativo', ARRAY['Tecnologia', 'Networking'], ${eventDates[0]}, '19:00', 'Florianópolis, SC', 'Av. das Nações, 1000', 150.00, 'O maior evento de tecnologia da região sul.', 200),
      ('Workshop de Culinária', 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800', 'Ativo', ARRAY['Gastronomia', 'Prático'], ${eventDates[1]}, '14:00', 'Curitiba, PR', 'Rua XV de Novembro, 500', 250.00, 'Aprenda técnicas avançadas com chefs renomados.', 30),
      ('Seminário Sustentabilidade', 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800', 'Ativo', ARRAY['Meio Ambiente', 'Futuro'], ${eventDates[2]}, '09:00', 'Belo Horizonte, MG', 'Alameda das Palmeiras, 20', 0.00, 'Debates sobre o futuro sustentável do planeta.', 500),
      ('Desfile de Moda Outono', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800', 'Ativo', ARRAY['Moda', 'Design'], ${eventDates[3]}, '20:00', 'São Paulo, SP', 'Av. Paulista, 1500', 80.00, 'Lançamento da coleção outono-inverno.', 150),
      ('Encontro de Yoga e Meditação', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800', 'Ativo', ARRAY['Bem-estar', 'Saúde'], ${eventDates[4]}, '18:30', 'Rio de Janeiro, RJ', 'Praia de Ipanema', 45.00, 'Uma tarde de relaxamento e conexão.', 100)
    `;

    // 4. Seed Products
    console.log('Seeding Products...');
    await sql`
      INSERT INTO products (name, description, price, image, brand_id, stock) VALUES
      ('Teclado Mecânico RGB', 'Teclado de alta performance para gamers e devs.', 450.00, 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400', ${brands[0].id}, 50),
      ('Livro de Receitas Exclusivas', 'As melhores receitas do Workshop Gourmet.', 89.90, 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400', ${brands[1].id}, 100),
      ('Bolsa de Couro Ecológica', 'Elegância com consciência ambiental.', 299.00, 'https://images.unsplash.com/photo-1584917033904-491a84b2ebff?w=400', ${brands[2].id}, 25),
      ('Kit Canudos de Bambu', 'Reduza seu consumo de plástico.', 35.00, 'https://images.unsplash.com/photo-1594498653385-d5172b532c00?w=400', ${brands[3].id}, 200),
      ('Tapete de Yoga Premium', 'Conforto e aderência para sua prática.', 120.00, 'https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=400', ${brands[4].id}, 60)
    `;

    // 5. Seed Users (Administrators and Users)
    console.log('Seeding Users...');
    await sql`
      INSERT INTO users (full_name, email, cpf, password_hash, is_admin, role) VALUES
      ('Carlos Silva', 'carlos@meetoff.com', '11122233344', ${passwordHash}, false, 'Usuário'),
      ('Mariana Costa', 'mariana@meetoff.com', '55566677788', ${passwordHash}, true, 'Diretora'),
      ('João Pereira', 'joao@meetoff.com', '99900011122', ${passwordHash}, false, 'Produtor'),
      ('Beatriz Matos', 'beatriz@meetoff.com', '33344455566', ${passwordHash}, true, 'Marketing'),
      ('Ricardo Santos', 'ricardo@meetoff.com', '77788899900', ${passwordHash}, false, 'Usuário')
      ON CONFLICT (email) DO NOTHING
    `;

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seed();
