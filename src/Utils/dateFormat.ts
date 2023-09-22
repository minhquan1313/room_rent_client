import dayjs from "dayjs";
import locale from "dayjs/locale/vi";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";

dayjs.extend(localizedFormat);

dayjs.extend(updateLocale);
dayjs.locale(locale);

dayjs.extend(relativeTime);

export const dateFormat = dayjs;