import { noEmptyRule } from "@/rules/noEmptyRule";
import { noWhiteSpaceRule } from "@/rules/noWhiteSpace";
import i18n from "@/translations/i18n";
import { RulesFunc } from "@/types/RuleFunc";
import { isValidPhone } from "@/utils/isValidPhoneNumber";
import logger from "@/utils/logger";

const { t } = i18n;

export const phoneRules: RulesFunc = () => [
  // {
  //   min: 6,
  //   message: "Mật khẩu từ 6 kí tự trở lên",
  // },
  noEmptyRule(),
  noWhiteSpaceRule(),
  ({ getFieldValue }) => ({
    message: t("Extra.Invalid tel number"),
    validator(_, value) {
      logger(`🚀 ~ validator ~ value:`, value);

      if (value === "" || value === undefined) return Promise.resolve();
      const rc =
        getFieldValue("region_code") || getFieldValue(["phone", "region_code"]);

      if (!rc) return Promise.reject(new Error(t("Extra.Missing region code")));

      if (value && rc && isValidPhone(value, rc)) return Promise.resolve();

      return Promise.reject();
    },
  }),
];
