import logger from "./logger";

export function trimObjectValues<T extends object>(o: T) {
  logger(`🚀 ~ o:`, o);

  const obj: any = {};

  Object.keys(o).forEach((key) => {
    const v = (o as any)[key];

    if (typeof v === "string") {
      obj[key] = v.trim();
      return;
    }

    if (typeof v === "object" && !Array.isArray(v)) {
      logger(`🚀 ~ Object.keys ~ v:`, v);

      obj[key] = trimObjectValues(v);
      return;
    }

    obj[key] = v;
  });

  return obj;
}
