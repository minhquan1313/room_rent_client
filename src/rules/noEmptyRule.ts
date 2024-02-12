import i18n from "@/translations/i18n";
import { Rule } from "antd/es/form";

const { t } = i18n;

export const noEmptyRule: Rule = {
  required: true,
  message: t("Extra.Don't leave it empty"),
};
