import { noEmptyRule } from "@/rules/noEmptyRule";
import { noWhiteSpaceRule } from "@/rules/noWhiteSpace";
import { Rule } from "antd/es/form";

export const usernameRules: Rule[] = [
  noEmptyRule,
  // {
  //   min: 6,
  //   message: "Tên người dùng từ 6 kí tự trở lên",
  // },
  noWhiteSpaceRule,
];
