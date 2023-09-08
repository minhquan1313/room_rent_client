import { CodeMap } from "@/types/CodeMap";
import codes from "country-calling-code";

export const telCodes: CodeMap[] = codes
  .filter((r) => {
    return !r.countryCodes[0].includes("-");
  })
  .sort((a, b) => {
    try {
      const numA = parseInt(a.countryCodes[0]);
      const numB = parseInt(b.countryCodes[0]);

      return numA - numB;
    } catch (error) {
      return 1;
    }
  })
  .filter((r, i, a) => {
    if (i > 0 && a[i - 1].countryCodes[0] == r.countryCodes[0]) {
      return false;
    }

    return true;
  })
  .map(({ countryCodes, isoCode2 }) => {
    return {
      code: isoCode2,
      label: countryCodes[0],
    };
  });
