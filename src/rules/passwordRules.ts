import { noEmptyRule } from "@/rules/noEmptyRule";
import { noWhiteSpaceRule } from "@/rules/noWhiteSpace";
import { RulesFunc } from "@/types/RuleFunc";

export const passwordRules: RulesFunc = () => [
  // {
  //   min: 6,
  //   message: "Mật khẩu từ 6 kí tự trở lên",
  // },
  noEmptyRule(),
  noWhiteSpaceRule(),
];
