import { Props } from "google-map-react";

// import { MyGoogleMapLoaderProps } from "@/types/MyGoogleMapLoaderTypes";

export type GGMapProps = Props;
export type GGMapPropsOmit = Omit<
  Props,
  "onGoogleApiLoaded" | "yesIWantToUseGoogleMapApiInternals"
>;
