import API_EN from "@/translations/en/apiCode.json";
import LOCATION_PATTERN_EN from "@/translations/en/locationConvertPattern.json";
import UI_EN from "@/translations/en/ui.json";
import API_VI from "@/translations/vi/apiCode.json";
import LOCATION_PATTERN_VI from "@/translations/vi/locationConvertPattern.json";
import UI_VI from "@/translations/vi/ui.json";

import locationFormatter from "@/translations/formatter/locationFormatter";
import removeAccentFormatter from "@/translations/formatter/removeAccentFormatter";
import { TGGMapLanguageCodes } from "@/types/TGGMapRegions";
import logger from "@/utils/logger";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export type TAvailableLanguage = keyof typeof resources;
export const languagesLabels: { [k in Extract<TGGMapLanguageCodes, TAvailableLanguage>]: string } = {
  vi: "Tiếng Việt",
  en: "English",
};

type TLanguageObserverCB = (lang: TAvailableLanguage) => void;
const languageChangeCbs: TLanguageObserverCB[] = [];

export function langChangeObserverAttach(cb: TLanguageObserverCB) {
  const index = languageChangeCbs.indexOf(cb);
  if (index !== -1) return;

  languageChangeCbs.push(cb);
}

i18n.on("languageChanged", (opt: TAvailableLanguage) => {
  languageChangeCbs.forEach((cb) => cb(opt));
});

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
i18n.services.formatter?.add("removeAccentFormatter", removeAccentFormatter);

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
