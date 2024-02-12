import { Rule } from "antd/es/form";

export const emailRule: Rule = {
  pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
  message: "Email không hợp lệ",
};
