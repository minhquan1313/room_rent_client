import { isProduction } from "@/utils/isProduction";

type TLogger = {
  (...s: unknown[]): void;
  error: (...s: unknown[]) => void;
};

const logger: TLogger = (() => {
  if (isProduction) {
    const v = () => {};
    v.error = (...s: unknown[]) => console.error(...s);
    // v.error = () => {};
    return v;
  }

  const v = (...s: unknown[]) => console.log(...s);
  v.error = (...s: unknown[]) => console.error(...s);

  return v;
})();

export default logger;
