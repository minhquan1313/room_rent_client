import { noEmptyRule } from "@/rules/noEmptyRule";
import { noWhiteSpaceRule } from "@/rules/noWhiteSpace";
import { RulesFunc } from "@/types/RuleFunc";

export const usernameRules: RulesFunc = () => [
  noEmptyRule(),
  // {
  //   min: 6,
  //   message: "Tên người dùng từ 6 kí tự trở lên",
  // },
  noWhiteSpaceRule(),
];
