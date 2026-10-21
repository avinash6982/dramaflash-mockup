// Euro price in the user's language: "€9.99" in English, "9,99 €" in German
export function formatEuro(amount: number, language: string): string {
  return new Intl.NumberFormat(language === "de" ? "de-DE" : "en", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}
