import { PhoneNumberUtil } from "google-libphonenumber";

const phoneUtil = PhoneNumberUtil.getInstance();

export function isValidPhone(phone: string | number, region_code: string) {
  try {
    const valid = phoneUtil.isValidNumber(
      phoneUtil.parse(
        typeof phone === "string" ? phone : phone.toString(),
        region_code,
      ),
    );

    return valid;
  } catch (error) {
    return false;
  }
}
