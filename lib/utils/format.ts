export const formatBRL = (value: string | number) => {
  const numericValue = typeof value === "string" ? parseFloat(value) : value;
  return numericValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export const formatDate = (date: string) => {
  if (!date) return "";
  // Handles YYYY-MM-DD or full ISO strings
  const d = new Date(date);
  // Using UTC to avoid timezone shifts for date-only strings
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
};

export const formatDateHour = (date: string) => {
  if (!date) return "";
  // Handles YYYY-MM-DD or full ISO strings
  const d = new Date(date);
  // Using UTC to avoid timezone shifts for date-only strings
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(d);
};
