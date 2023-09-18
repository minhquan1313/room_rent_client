import { fetcher } from "@/services/fetcher";
import { LocationResolve } from "@/types/Location3rd";

export async function locationResolve(
  country: string,
  province?: string,
  district?: string,
  ward?: string,
) {
  const params = new URLSearchParams();
  country && params.append("country", country);
  province && params.append("province", province);
  district && params.append("district", district);
  ward && params.append("ward", ward);

  const url = `/location/resolve?${params.toString()}`;
  const data = await fetcher.get<never, LocationResolve>(url);

  return data;
}
