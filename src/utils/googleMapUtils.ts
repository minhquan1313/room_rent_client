import { VITE_GOOGLE_MAP_API_KEY } from "@/constants/env";
import { langRegionMapI18n } from "@/constants/googleMapConstants";
import { TAvailableLanguage } from "@/translations/i18n";
import logger from "@/utils/logger";
import { BootstrapURLKeys, Coords } from "google-map-react";

type KeyType = BootstrapURLKeys;
// MapKeys
// -=-=GG MAP REACT COMPONENT KEY
export function ggMapKeyGenerator(language: TAvailableLanguage): KeyType {
  return {
    key: VITE_GOOGLE_MAP_API_KEY,
    language: langRegionMapI18n[language][0],
    region: langRegionMapI18n[language][1],
    // libraries: ["marker"],
  };
}

// -=-=GEOCODER
export function getAddressFromMarker(
  geocoder: google.maps.Geocoder,
  latLng: Coords,
) {
  return new Promise<google.maps.GeocoderResult | null>((r, rj) => {
    geocoder.geocode({ location: latLng }, function (results, status) {
      if (status === "OK") {
        if (results && results[0]) {
          logger(`🚀 ~ results:`, results);

          const res = results.sort(
            (a, b) => b.address_components.length - a.address_components.length,
          )[0];
          logger(`🚀 ~ res:`, res);

          const address = res.formatted_address;
          logger(`🚀 ~ address:`, address);

          return r(res);
        } else {
          logger("Không tìm thấy địa chỉ");
          return r(null);
        }
      }

      logger("Lỗi khi lấy địa chỉ: " + status);
      return rj(status);
    });
  });
}

export function geoLocationExtract(geoLocation: google.maps.GeocoderResult) {
  const [district, province, country] = geoLocation.address_components
    .slice(-3)
    .map((e) => e.long_name);
  const str = geoLocation.formatted_address.split(", ").slice(0, -3);
  const ward = str.pop();
  const detail = str.join(", ");

  return { country, province, district, ward, detail };
}
