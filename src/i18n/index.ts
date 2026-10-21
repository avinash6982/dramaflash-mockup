import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";
import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";

import { de } from "./de";
import { en } from "./en";

export type Language = "en" | "de";

const STORAGE_KEY = "language";

const i18n = createInstance();

// The saved choice wins; otherwise German if the device is German, else English
async function getStartLanguage(): Promise<Language> {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "de") return saved;
  } catch {
    // storage unavailable (e.g. private browsing): fall back to the device language
  }
  return getLocales()[0]?.languageCode === "de" ? "de" : "en";
}

// Call once at startup and wait for it before rendering any screen
export async function initI18n() {
  await i18n.use(initReactI18next).init({
    resources: { en: { translation: en }, de: { translation: de } },
    lng: await getStartLanguage(),
    fallbackLng: "en",
    interpolation: { escapeValue: false }, // React already escapes
  });
}

// Switch language and remember the choice for the next launch
export async function setLanguage(language: Language) {
  await i18n.changeLanguage(language);
  try {
    await AsyncStorage.setItem(STORAGE_KEY, language);
  } catch {
    // the language still switches for this session
  }
}

export default i18n;
