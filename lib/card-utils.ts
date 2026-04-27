import { neon } from '@neondatabase/serverless';

function generateCVV() {
  return Math.floor(100 + Math.random() * 900).toString();
}

function generateCardNumber() {
  // Generate a realistic looking 16-digit number
  let res = '4444 ';
  for (let i = 0; i < 3; i++) {
    res += Math.floor(1000 + Math.random() * 9000).toString() + (i < 2 ? ' ' : '');
  }
  return res;
}

function generateExpiryDate() {
  const now = new Date();
  const year = (now.getFullYear() + 5).toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  return `${month}/${year}`;
}

export async function getCardByToken(token: string) {
  const sql = neon(process.env.DATABASE_URL!);
  const result = await sql`SELECT * FROM cards WHERE qr_code_token = ${token}`;
  return result[0];
}

export async function getCardByActivationCode(code: string) {
  const sql = neon(process.env.DATABASE_URL!);
  const result = await sql`SELECT * FROM cards WHERE activation_code = ${code}`;
  return result[0];
}

export async function activateCard(cardId: string, userId: string, name: string, birthDate: string) {
  const sql = neon(process.env.DATABASE_URL!);
  const cvv = generateCVV();
  const cardNumber = generateCardNumber();
  const expiry = generateExpiryDate();

  await sql`
    UPDATE cards 
    SET 
      status = 'ATIVO', 
      owner_id = ${userId}, 
      name = ${name}, 
      birth_date = ${birthDate},
      cvv = ${cvv},
      card_number = ${cardNumber},
      expiry_date = ${expiry},
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${cardId}
  `;
}

export async function createGreenCard(userId: string, name: string, birthDate: string) {
  const sql = neon(process.env.DATABASE_URL!);
  const qrToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const cvv = generateCVV();
  const cardNumber = generateCardNumber();
  const expiry = generateExpiryDate();
  
  const result = await sql`
    INSERT INTO cards (type, status, owner_id, name, birth_date, qr_code_token, cvv, card_number, expiry_date)
    VALUES ('GREEN', 'ATIVO', ${userId}, ${name}, ${birthDate}, ${qrToken}, ${cvv}, ${cardNumber}, ${expiry})
    RETURNING *
  `;
  return result[0];
}
