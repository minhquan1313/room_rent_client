import { TI18nFormatter } from "@/types/TI18nFormatter";
import { removeAccents } from "@/utils/removeAccents";

const removeAccentFormatter: TI18nFormatter = (value) => {
  return removeAccents(value);
};

export default removeAccentFormatter;
