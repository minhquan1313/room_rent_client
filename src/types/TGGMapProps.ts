import { TGGMapLanguageNames, TGGMapRegionNames } from "@/types/TGGMapRegions";
import { Props } from "google-map-react";

// import { MyGoogleMapLoaderProps } from "@/types/MyGoogleMapLoaderTypes";

export type GGMapProps = Props;
export type GGMapPropsOmit = Omit<Props, "yesIWantToUseGoogleMapApiInternals" | "zoom" | "bootstrapURLKeys"> & {
  googleMapKeys?: Props["bootstrapURLKeys"];
};

export interface TGeocoderRequest extends google.maps.GeocoderRequest {
  region?: TGGMapRegionNames;
  language?: TGGMapLanguageNames;
}
