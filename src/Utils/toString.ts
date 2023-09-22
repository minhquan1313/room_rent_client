import { IRoomLocation } from "@/types/IRoomLocation";
import { IUser } from "@/types/IUser";

export const toStringLocation = (
  l: Partial<
    Pick<IRoomLocation, "detail_location" | "ward" | "district" | "province">
  >,
  full = true,
) => {
  const { detail_location, ward, district, province } = l;

  return [full && detail_location, ward, district, province]
    .filter((r) => r)
    .join(", ");
};

export const toStringUserName = (u?: IUser | null) => {
  if (!u) return "";

  return `${u.last_name ?? ""} ${u.first_name}`;
};
