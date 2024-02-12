import LOCALE_EN from "antd/locale/en_US";
import LOCALE_VN from "antd/locale/vi_VN";

import { TAvailableLanguage } from "@/translations/i18n";
import { ConfigProvider } from "antd";
import { Locale } from "antd/es/locale";
import { ReactNode, createContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  children: ReactNode;
};

const localeMap: {
  [k in TAvailableLanguage]: Locale;
} = {
  vi: LOCALE_VN,
  en: LOCALE_EN,
};

export const AntDProvider = createContext(null);

export default function GlobalDataProvider({ children }: Props) {
  const { i18n } = useTranslation();
  const [locale, setLocale] = useState<Locale>();

  useEffect(() => {
    const lang = i18n.language as TAvailableLanguage;

    setLocale(localeMap[lang]);
  }, [i18n.language]);

  return (
    <AntDProvider.Provider value={null}>
      <ConfigProvider locale={locale}>{children}</ConfigProvider>
    </AntDProvider.Provider>
  );
}
