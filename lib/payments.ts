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
  return isPaymentTestMode() ? "test_user_452052302339750539@testuser.com" : email;
}

export function getFriendlyPaymentErrorMessage(detail: string): string {
  // Normalize the detail by removing the "cc_rejected_" prefix if present
  const normalizedDetail = detail ? detail.replace(/^cc_rejected_/, "").toLowerCase() : "";

  switch (normalizedDetail) {
    case "bad_filled_card_number":
      return "Número do cartão inválido.";
    case "bad_filled_date":
      return "Data de vencimento incorreta.";
    case "bad_filled_other":
      return "Dados do cartão incorretos.";
    case "bad_filled_security_code":
      return "Código de segurança (CVV) incorreto.";
    case "blacklist":
      return "Cartão bloqueado para esta transação.";
    case "call_for_authorize":
      return "Transação não autorizada. Entre em contato com o banco emissor do cartão para liberar.";
    case "card_disabled":
      return "O cartão está desabilitado. Entre em contato com seu banco.";
    case "card_error":
      return "Erro ao processar o cartão. Tente novamente ou use outro cartão.";
    case "duplicated_payment":
      return "Pagamento duplicado. Aguarde alguns instantes.";
    case "high_risk":
      return "Transação recusada por políticas de segurança (análise de risco). Use outro cartão ou tente mais tarde.";
    case "insufficient_amount":
      return "Saldo ou limite insuficiente no cartão.";
    case "invalid_installments":
      return "O número de parcelas selecionado é inválido para este cartão.";
    case "max_attempts":
      return "Limite de tentativas excedido. Tente novamente mais tarde.";
    default:
      return "Pagamento recusado. Verifique os dados do cartão, limite e tente novamente.";
  }
}

export function parseMercadoPagoError(error: any): { status: number; status_detail: string; message: string } {
  let status = error.status || 402;
  let status_detail = "";
  let message = "Erro ao processar pagamento. Verifique os dados e tente novamente.";

  // If error has a details property (which is the parsed response data)
  const details = error.details || error;

  // 1. Try to extract status_detail from Orders API response structure
  if (details?.data?.transactions?.payments?.[0]?.status_detail) {
    status_detail = details.data.transactions.payments[0].status_detail;
  }
  // 2. Try to extract from the error details list (e.g. ["PAY01KS3302YN4PC2VJH7HG33HEB6: high_risk"])
  else if (details?.errors && Array.isArray(details.errors)) {
    for (const err of details.errors) {
      if (err.details && Array.isArray(err.details)) {
        for (const det of err.details) {
          if (typeof det === "string" && det.includes(":")) {
            const parts = det.split(":");
            status_detail = parts[parts.length - 1].trim();
            break;
          }
        }
      }
      if (status_detail) break;
    }
  }
  // 3. Fallback to cause for legacy Payments API
  else if (details?.cause && Array.isArray(details.cause) && details.cause.length > 0) {
    status_detail = details.cause[0].code || details.cause[0].description || "";
  }

  // If we found a status_detail, map it to a friendly message
  if (status_detail) {
    message = getFriendlyPaymentErrorMessage(status_detail);
  } else if (error.message && error.message !== "The following transactions failed" && error.message !== "Internal server error") {
    // If we have a specific error message (not the generic ones), use it
    message = error.message;
  }

  return {
    status,
    status_detail,
    message,
  };
}

