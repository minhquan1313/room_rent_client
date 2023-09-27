import { noWhiteSpace } from "@/rules/noWhiteSpace";
import { isValidPhone } from "@/utils/isValidPhoneNumber";
import { Rule } from "antd/es/form";

export const phoneRule: Rule[] = [
  // {
  //   min: 6,
  //   message: "Mật khẩu từ 6 kí tự trở lên",
  // },
  noWhiteSpace,
  ({ getFieldValue }) => ({
    message: "Số điện thoại không hợp lệ",
    validator(_, value) {
      const rc =
        getFieldValue("region_code") || getFieldValue(["phone", "region_code"]);

      if (!rc) return Promise.reject(new Error("Thiếu mã vùng"));

      if (value && rc && isValidPhone(value, rc)) return Promise.resolve();

      return Promise.reject();
    },
  }),
];
