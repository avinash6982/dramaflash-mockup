// Euro price in the user's language: "€9.99" in English, "9,99 €" in German
export function formatEuro(amount: number, language: string): string {
  return new Intl.NumberFormat(language === "de" ? "de-DE" : "en", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

// Short count for like numbers: "12K" in English, "12.000" in German
export function formatCount(count: number, language: string): string {
  return new Intl.NumberFormat(language === "de" ? "de-DE" : "en", {
    notation: "compact",
  }).format(count);
}

// Whole number with the language's grouping: "6,000" in English, "6.000" in German
export function formatNumber(value: number, language: string): string {
  return new Intl.NumberFormat(language === "de" ? "de-DE" : "en").format(value);
}

// "21 Nov 2026" in English, "21. Nov. 2026" in German
export function formatDate(timestamp: number, language: string): string {
  return new Intl.DateTimeFormat(language === "de" ? "de-DE" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(timestamp));
}
