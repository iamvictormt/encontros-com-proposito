/**
 * Formata o Telefone com máscara (XX) XXXXX-XXXX
 */
export function formatPhone(value: string): string {
  // Remove tudo que não é dígito
  const numbers = value.replace(/\D/g, "");

  // Limita a 11 dígitos
  const limited = numbers.slice(0, 11);

  // Aplica a máscara
  if (limited.length === 0) return "";
  if (limited.length <= 2) return `(${limited}`;
  if (limited.length <= 6) return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
  if (limited.length <= 10)
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 6)}-${limited.slice(6)}`;
  return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`;
}

/**
 * Remove a máscara do Telefone
 */
export function unformatPhone(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Valida se o Telefone é válido
 */
export function validatePhone(phone: string): boolean {
  const numbers = phone.replace(/\D/g, "");
  return numbers.length >= 10 && numbers.length <= 11;
}

/**
 * Valida se o email é válido
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,10}$/;
  return emailRegex.test(email);
}

/**
 * Detecta se o input é um Telefone (apenas números ou parênteses) ou email (contém @)
 */
export function detectInputType(value: string): "phone" | "email" | "unknown" {
  if (value.includes("@")) return "email";
  if (/^[\d(]/.test(value)) return "phone";
  return "email";
}
/**
 * Valida se a data de nascimento corresponde a maioridade (18 anos)
 */
export function validateMinAge(birthDate: string, minAge: number = 18): boolean {
  if (!birthDate) return false;
  
  const today = new Date();
  const birth = new Date(birthDate);
  
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age >= minAge;
}
