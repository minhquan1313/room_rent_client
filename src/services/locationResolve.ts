import { fetcher } from "@/services/fetcher";
import { LocationResolve } from "@/types/Location3rd";
import locationMap from "@/utils/locationMap";

export async function locationResolve(country: string, province?: string, district?: string, ward?: string) {
  const params = new URLSearchParams();
  country && params.append("country", locationMap(country));
  province && params.append("province", locationMap(province));
  district && params.append("district", locationMap(district));
  ward && params.append("ward", locationMap(ward));

  const url = `/location/resolve?${params.toString()}`;
  const data = await fetcher.get<never, LocationResolve>(url);

  return data;
}
