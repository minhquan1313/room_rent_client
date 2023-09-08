import { CodeMap } from "@/types/CodeMap";
import currencyToSymbolMap from "currency-symbol-map/map";

export const currencyCodes: CodeMap[] = Object.keys(currencyToSymbolMap)
  .map((code) => {
    return {
      code,
      label: currencyToSymbolMap[code],
    };
  })
  .sort((a, b) => {
    return a.code.localeCompare(b.code);
  });
