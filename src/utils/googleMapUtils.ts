import { VITE_GOOGLE_MAP_API_KEY } from "@/constants/env";
import { langRegionMapI18n } from "@/constants/googleMapConstants";
import { TAvailableLanguage } from "@/translations/i18n";
import { TGGMapLanguageCodes } from "@/types/TGGMapRegions";
import { BootstrapURLKeys } from "google-map-react";

type KeyType = BootstrapURLKeys;
// MapKeys
// -=-=GG MAP REACT COMPONENT KEY
export function ggMapKeyGenerator(data: {
  //
  language: Extract<TGGMapLanguageCodes, TAvailableLanguage>;
}): KeyType {
  const { language } = data;

  return {
    key: VITE_GOOGLE_MAP_API_KEY,
    language: langRegionMapI18n[language][0],
    region: langRegionMapI18n[language][1],
    version: "3.56.1",
    // libraries: ["marker"],
  };
}
// -=-=GEOCODER

export function geoLocationExtract(geoLocation: google.maps.GeocoderResult) {
  const [district, province, country] = geoLocation.address_components
    // remove redundant postal_code 700000 of last index
    .filter((compo) => !compo.types.includes("postal_code"))
    // take last 3 index
    .slice(-3)
    .map((e) => e.long_name);

  const str = geoLocation.formatted_address.split(", ").slice(0, -2);

  /**
   * JM56+4CM, Thanh Hà, Tân Kim, Cần Giuộc, Long An, Vietnam
   * => length=4
   * 7C24+8HV, Ấp Phú Hữu, Bến Tre, Vietnam
   * => length=2
   * Phạm Văn Chiêu, Gò Vấp, Thành phố Hồ Chí Minh, Việt Nam
   * => length =2
   */
  let ward = str.pop();
  if (str.length >= 2 || (str.length === 1 && ward === district)) {
    ward = str.pop();
  }

  const detail = str.join(", ");

  return { country, province, district, ward, detail };
}
