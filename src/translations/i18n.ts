import API_EN from "@/translations/en/apiCode.json";
import LOCATION_PATTERN_EN from "@/translations/en/locationConvertPattern.json";
import UI_EN from "@/translations/en/ui.json";

import API_VI from "@/translations/vi/apiCode.json";
import LOCATION_PATTERN_VI from "@/translations/vi/locationConvertPattern.json";
import UI_VI from "@/translations/vi/ui.json";

import locationFormatter from "@/translations/formatter/locationFormatter";
import logger from "@/utils/logger";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export type TAvailableLanguage = keyof typeof languagesLabels;
export const languagesLabels = {
  vi: "Tiếng Việt",
  en: "English",
};

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
export const resources = {
  en: {
    ui: UI_EN,
    api: API_EN,
    location: LOCATION_PATTERN_EN,
  },
  vi: {
    ui: UI_VI,
    api: API_VI,
    location: LOCATION_PATTERN_VI,
  },
};

export const defaultNS = "ui";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,

    lng: readLanguage() || "vi",
    fallbackLng: "vi",

    ns: ["ui", "api"],
    defaultNS,

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });
i18n.services.formatter?.add("locationFormatter", locationFormatter);

export function saveLanguage(language: string) {
  if (!i18n.isInitialized) logger.error("i18n not initialized");

  localStorage.setItem("language", language);
}

export function readLanguage() {
  const lang = localStorage.getItem("language");
  logger({ lang });
  return lang;
}

export default i18n;
