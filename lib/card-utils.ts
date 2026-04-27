import { neon } from '@neondatabase/serverless';

function generateCVV() {
  return Math.floor(100 + Math.random() * 900).toString();
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

  await sql`
    UPDATE cards 
    SET 
      status = 'ATIVO', 
      owner_id = ${userId}, 
      name = ${name}, 
      birth_date = ${birthDate},
      cvv = ${cvv},
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${cardId}
  `;
}

export async function createGreenCard(userId: string, name: string, birthDate: string) {
  const sql = neon(process.env.DATABASE_URL!);
  const qrToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const cvv = generateCVV();
  
  const result = await sql`
    INSERT INTO cards (type, status, owner_id, name, birth_date, qr_code_token, cvv)
    VALUES ('GREEN', 'ATIVO', ${userId}, ${name}, ${birthDate}, ${qrToken}, ${cvv})
    RETURNING *
  `;
  return result[0];
}
