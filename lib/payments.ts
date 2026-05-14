export const TEST_PAYMENT_AMOUNT = 1;

export function isPaymentTestMode() {
  return process.env.NEXT_PUBLIC_TEST_MODE === "true";
}

export function resolvePaymentAmount(amount: number) {
  return amount;
}

export function resolvePayerEmail(email: string) {
  return isPaymentTestMode() ? "test_user_5936489190012169711@testuser.com" : email;
}
