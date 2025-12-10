/**
 * Formata o CPF com máscara XXX.XXX.XXX-XX
 */
export function formatCPF(value: string): string {
  // Remove tudo que não é dígito
  const numbers = value.replace(/\D/g, '');

  // Limita a 11 dígitos
  const limited = numbers.slice(0, 11);

  // Aplica a máscara
  if (limited.length <= 3) return limited;
  if (limited.length <= 6) return `${limited.slice(0, 3)}.${limited.slice(3)}`;
  if (limited.length <= 9) return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6)}`;
  return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6, 9)}-${limited.slice(9)}`;
}

/**
 * Remove a máscara do CPF
 */
export function unformatCPF(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Valida se o CPF é válido
 */
export function validateCPF(cpf: string): boolean {
  const numbers = cpf.replace(/\D/g, '');

  if (numbers.length !== 11) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(numbers)) return false;

  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += Number.parseInt(numbers.charAt(i)) * (10 - i);
  }
  let remainder = 11 - (sum % 11);
  const digit1 = remainder >= 10 ? 0 : remainder;

  if (digit1 !== Number.parseInt(numbers.charAt(9))) return false;

  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += Number.parseInt(numbers.charAt(i)) * (11 - i);
  }
  remainder = 11 - (sum % 11);
  const digit2 = remainder >= 10 ? 0 : remainder;

  if (digit2 !== Number.parseInt(numbers.charAt(10))) return false;

  return true;
}

/**
 * Valida se o email é válido
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,10}$/;
  return emailRegex.test(email);
}

/**
 * Detecta se o input é um CPF (apenas números) ou email (contém @)
 */
export function detectInputType(value: string): 'cpf' | 'email' | 'unknown' {
  if (value.includes('@')) return 'email';
  if (/^\d/.test(value) || /^\d{3}\./.test(value)) return 'cpf';
  return 'email';
}
