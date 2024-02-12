import LOCALE_EN from "dayjs/locale/en";
import LOCALE_VI from "dayjs/locale/vi";

import i18n, {
  TAvailableLanguage,
  langChangeObserverAttach,
} from "@/translations/i18n";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekday from "dayjs/plugin/weekday";

dayjs.extend(duration);

dayjs.extend(localizedFormat);

dayjs.extend(relativeTime);

dayjs.extend(weekday);
dayjs.extend(weekOfYear);

function updateLocale(lang: TAvailableLanguage) {
  console.log(`🚀 ~ updateLocale ~ lang:`, lang);

  const localeMap = {
    vi: LOCALE_VI,
    en: LOCALE_EN,
  };

  dayjs.locale(localeMap[lang]);
}

langChangeObserverAttach(updateLocale);
updateLocale(i18n.language as TAvailableLanguage);

export const dateFormat = dayjs;
