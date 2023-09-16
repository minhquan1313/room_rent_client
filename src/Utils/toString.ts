import { IRoomLocation } from "@/types/IRoomLocation";

export const locationToString = (l: IRoomLocation, full = true) => {
  const { detail_location, ward, district, province } = l;

  return [full && detail_location, ward, district, province]
    .filter((r) => r)
    .join(", ");
};
