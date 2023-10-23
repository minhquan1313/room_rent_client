import { GetAliases, _ConversionFamilyId } from "convert";

export type TMeasureUnit = "m2" | "ft2" | "mi2";

export type TMeasureUnit2 = GetAliases<_ConversionFamilyId.Area>;
