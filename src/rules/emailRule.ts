import i18n from "@/translations/i18n";
import { RuleFunc } from "@/types/RuleFunc";

const { t } = i18n;

export const emailRule: RuleFunc = () => ({
  pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
  message: t("Extra.Email not valid"),
});
