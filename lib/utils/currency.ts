const BRL = {
  locale: "pt-BR",
  currency: "BRL",
} as const;

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat(BRL.locale, {
    style: "currency",
    currency: BRL.currency,
  }).format(value);
}

export function parseCurrency(value: string): number {
  const cleaned = value.replace(/\D/g, "");
  return cleaned ? Number(cleaned) / 100 : 0;
}

export function formatCurrencyInput(value: number): string {
  if (Number.isNaN(value) || value === 0) return "";
  return new Intl.NumberFormat(BRL.locale, {
    style: "currency",
    currency: BRL.currency,
  }).format(value);
}
