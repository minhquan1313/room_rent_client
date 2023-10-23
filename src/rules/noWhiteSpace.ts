import { Rule } from "antd/es/form";

export const noWhiteSpace: Rule[] = [
  {
    pattern: /^[^\s]*$/,
    message: "Không chứa khoảng trắng",
  },
];
