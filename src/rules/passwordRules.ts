import { noEmptyRule } from "@/rules/noEmptyRule";
import { noWhiteSpaceRule } from "@/rules/noWhiteSpace";
import { Rule } from "antd/es/form";

export const passwordRules: Rule[] = [
  // {
  //   min: 6,
  //   message: "Mật khẩu từ 6 kí tự trở lên",
  // },
  noEmptyRule,
  noWhiteSpaceRule,
];
