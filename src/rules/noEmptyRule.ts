import i18n from "@/translations/i18n";
import { RuleFunc } from "@/types/RuleFunc";

const { t } = i18n;

export const noEmptyRule: RuleFunc = () => ({
  required: true,
  message: t("Extra.Don't leave it empty"),
});
