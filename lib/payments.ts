export const TEST_PAYMENT_AMOUNT = 1; // 1 real

export function isPaymentTestMode() {
  return process.env.NEXT_PUBLIC_TEST_MODE === "true";
}

export function isForceMinimumPrice() {
  return process.env.NEXT_PUBLIC_FORCE_MINIMUM_PRICE === "true";
}

export function resolvePaymentAmount(amount: number) {
  if (isForceMinimumPrice()) {
    return TEST_PAYMENT_AMOUNT;
  }
  return amount;
}

export function resolvePayerEmail(email: string) {
  return isPaymentTestMode() ? "test_user_5936489190012169711@testuser.com" : email;
}
