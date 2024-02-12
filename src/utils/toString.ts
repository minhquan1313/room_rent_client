import { currencyCodes } from "@/constants/currencyCodes";
import i18n from "@/translations/i18n";
import { IRoomLocation } from "@/types/IRoomLocation";
import { IUser } from "@/types/IUser";

export const toStringLocation = (
  location: Partial<
    Pick<IRoomLocation, "detail_location" | "ward" | "district" | "province">
  >,
  full = true,
) => {
  const { t } = i18n;
  const { detail_location, ward, district, province } = location;

  return [
    full && detail_location,
    t("location:translate", { val: ward }),
    t("location:translate", { val: district }),
    t("location:translate", { val: province }),
  ]
    .filter((r) => r)
    .join(", ");
};

export const toStringUserName = (u?: IUser | null) => {
  if (!u) return "";

  return `${u.last_name ?? ""} ${u.first_name}`.trim();
};

export const toStringCurrencyCode = (code: string) => {
  return (
    currencyCodes.find((currency) => currency.code === code)?.label || code
  );
};
