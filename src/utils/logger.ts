import { isProduction } from "@/utils/isProduction";

export const logger = (() => {
  if (isProduction) {
    //
  }

  const v = (...s: unknown[]) => console.log(...s);
  v.error = console.error;

  return v;
})();
// (...s: unknown[]) => console.log(...s)
