import { googleMapLanguages } from "@/constants/googleMapLanguages";
import { googleMapRegions } from "@/constants/googleMapRegions";
import { TGGMapLanguageNames, TGGMapRegionNames } from "@/types/TGGMapRegions";

export const ggMapRegionMap = (value?: TGGMapRegionNames) => {
  return value === undefined ? undefined : googleMapRegions[value];
};

export const ggMapLanguageMap = (value?: TGGMapLanguageNames) => {
  return value === undefined ? undefined : googleMapLanguages[value];
};
