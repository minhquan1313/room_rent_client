import LOCALE_EN from "dayjs/locale/en";
import LOCALE_VI from "dayjs/locale/vi";

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

export const dateFormat = dayjs;

export function onLanguageChangeDayjs(lang: "vi" | "en") {
  const localeMap = {
    vi: LOCALE_VI,
    en: LOCALE_EN,
  };

  dayjs.locale(localeMap[lang]);
}
