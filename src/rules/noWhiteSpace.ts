import i18n from "@/translations/i18n";
import { RuleFunc } from "@/types/RuleFunc";

const { t } = i18n;

export const noWhiteSpaceRule: RuleFunc = () => ({
  pattern: /^[^\s]*$/,
  message: t("Extra.No space character allowed"),
});
