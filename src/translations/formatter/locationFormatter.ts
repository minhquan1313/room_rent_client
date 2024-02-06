import i18n from "@/translations/i18n";
import { removeAccents } from "@/utils/removeAccents";
import { Formatter } from "i18next";

type IPatternType = "str" | "num" | undefined;

const locationFormatter: Parameters<Formatter["add"]>["1"] = (
  value,
  lang,
  options,
) => {
  if (typeof value !== "string" || !lang) return value;

  const locationI18n = i18n.getResourceBundle(lang, "location");

  const patterns = locationI18n["pattern"];

  const { matchPattern, nameWithoutPostfix } = extractPatternKey(
    patterns,
    value,
  );

  if (!matchPattern || !nameWithoutPostfix) return value;

  const str = i18n.t(`location:pattern.${matchPattern}` as any, {
    val: (locationI18n["removeAccent"]
      ? removeAccents(nameWithoutPostfix)
      : nameWithoutPostfix
    ).trim(),
  });

  return str;
};

function isMatchPatternType(restStr: string, type: IPatternType) {
  switch (type) {
    case "num":
      return !Number.isNaN(Number(restStr));

    case "str":
      return Number.isNaN(Number(restStr));

    default:
      return true;
  }
}

function extractPatternKey(patterns: any, value: string) {
  let matchPattern: string | undefined;
  let key, type, nameWithoutPostfix;

  for (const pattern of Object.keys(patterns)) {
    [key, type] = pattern.split("@") as [string, IPatternType];

    if (value.toLowerCase().indexOf(key) !== 0) continue;

    matchPattern = pattern;

    nameWithoutPostfix = value.slice(key.length);
    if (!isMatchPatternType(nameWithoutPostfix, type)) {
      matchPattern = undefined;
      continue;
    }

    break;
  }

  return { key, type, matchPattern, nameWithoutPostfix };
}

export default locationFormatter;
