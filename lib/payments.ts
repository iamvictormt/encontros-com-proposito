export const TEST_PAYMENT_AMOUNT = 1;

export function isPaymentTestMode() {
  return process.env.NEXT_PUBLIC_TEST_MODE === "true";
}

export function resolvePaymentAmount(amount: number) {
  return isPaymentTestMode() ? TEST_PAYMENT_AMOUNT : amount;
}

export function resolvePayerEmail(email: string) {
  return isPaymentTestMode() ? "comprador.teste@meetoff.com.br" : email;
}
