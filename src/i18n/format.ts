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
