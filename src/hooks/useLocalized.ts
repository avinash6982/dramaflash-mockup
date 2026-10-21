import { useTranslation } from "react-i18next";

import { localize } from "@/i18n/localized";
import type { LocalizedText } from "@/i18n/localized";

// Returns a function that picks the current language from a { en, de } text
export function useLocalized() {
  const { i18n } = useTranslation();
  return (text: LocalizedText) => localize(text, i18n.language);
}
