import { googleMapLanguages } from "@/constants/googleMapLanguages";
import { googleMapRegions } from "@/constants/googleMapRegions";

export type TGGMapRegionNames = keyof typeof googleMapRegions;
export type TGGMapLanguageNames = keyof typeof googleMapLanguages;

export type TGGMapRegionCodes = (typeof googleMapRegions)[TGGMapRegionNames];
export type TGGMapLanguageCodes = (typeof googleMapLanguages)[TGGMapLanguageNames];
