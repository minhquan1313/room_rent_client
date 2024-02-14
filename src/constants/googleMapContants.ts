import { TAvailableLanguage } from "@/translations/i18n";
import { Coords, MapOptions } from "google-map-react";

export const ggMapZoom = 10;
export const ggMapOptions: MapOptions = {
  disableDefaultUI: true,
  clickableIcons: false,
  scrollwheel: true,
};
export const ggMapCenter: Coords = {
  lat: 10.79626,
  lng: 106.6393655,
};

/**
 * [https://developers.google.com/maps/faq#languagesupport, https://developers.google.com/maps/coverage#coverage-legend]
 */
export const langRegionMapI18n: {
  [k in TAvailableLanguage]: [string, string];
} = {
  vi: ["vi", "VN"],
  en: ["en", "VN"],
};
