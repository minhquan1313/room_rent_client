import dayjs from "dayjs";
import locale from "dayjs/locale/vi";
import duration from "dayjs/plugin/duration";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";

dayjs.extend(duration);

dayjs.extend(localizedFormat);

dayjs.extend(updateLocale);
dayjs.locale(locale);

dayjs.extend(relativeTime);

dayjs.extend(weekday);
dayjs.extend(weekOfYear);

export const dateFormat = dayjs;
