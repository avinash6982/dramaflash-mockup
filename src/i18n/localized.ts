export type Language = "en" | "de";

// Text that exists in both languages (series titles, descriptions, episode titles, ...)
export type LocalizedText = Record<Language, string>;

export function localize(text: LocalizedText, language: string): string {
  return text[language === "de" ? "de" : "en"];
}
