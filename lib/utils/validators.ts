/**
 * Valida se o email é válido
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,10}$/;
  return emailRegex.test(email);
}
