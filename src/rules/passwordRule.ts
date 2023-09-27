import { noWhiteSpace } from "@/rules/noWhiteSpace";
import { Rule } from "antd/es/form";

export const passwordRule: Rule[] = [
  // {
  //   min: 6,
  //   message: "Mật khẩu từ 6 kí tự trở lên",
  // },
  noWhiteSpace,
];
