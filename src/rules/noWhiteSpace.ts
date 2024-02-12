import i18n from "@/translations/i18n";
import { Rule } from "antd/es/form";

const { t } = i18n;

export const noWhiteSpaceRule: Rule = {
  pattern: /^[^\s]*$/,
  message: t("Extra.No space character allowed"),
};
