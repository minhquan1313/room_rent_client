import logger from "@/utils/logger";
import { InputNumberProps } from "antd";

type FormatterParams = Parameters<Exclude<InputNumberProps["formatter"], undefined>>;

type TFormatter = (value: FormatterParams["0"], info?: FormatterParams["1"] | boolean) => string;
// type TFormatter = Exclude<InputNumberProps["formatter"], undefined>;
type TParser = (displayValue: string | undefined) => string;

export const numberFormat: TFormatter = (value): string => {
  value = `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return value;
};

export const moneyInputFormat: TFormatter = (value, info) => {
  if (!value) return "";

  value = String(value);

  const num = Number(value);
  if (isNaN(num)) return "";
  if (num === 0) return "0";

  if (info === true) {
    // 9.000.000 => 9.000K
    value = value.slice(0, -3) + "K";
  }
  return numberFormat(value);
};

/**
 * use this this parse money, use it with numberFormat only
 */
export const moneyParser: TParser = (value) => {
  let v = numberParser(value);
  logger(`~🤖 numberFormat 🤖~ v`, { v });

  // if (v.length === 4) {
  //   logger(`~🤖 numberFormat 🤖~ 1`);

  //   v += "000";
  // } else
  if (v.length > 4) {
    logger(`~🤖 numberFormat 🤖~ 1`);
    const last = v.slice(-1);
    const last2 = v.slice(-2, -1);

    if (last === "0") {
      v = v.slice(0, -3) + "000";
    } else if (last2 === "0") {
      v = v.slice(0, -4) + last + "000";
    } else {
      // copy paste number
      // 12345 => 5 !== 0 and 4 !==0
      v += "000";
    }
  } else if (v.length < 4) {
    logger(`~🤖 numberFormat 🤖~ 2`);
    const last = v.slice(-1);
    if (last !== "0") {
      v += "000";
    }
  } else {
    logger(`~🤖 numberFormat 🤖~ 3`);
    if (v[3] === "0" && v[2] === "0") {
      v = v.slice(0, -3) + "000";
    } else {
      v += "000";
    }
  }

  logger(`~🤖 numberFormat 🤖~ v3`, { v });
  return v;
};
export const numberParser: TParser = (value) => {
  const v = value!.replace(/\$\s?|(,*)/g, "");

  return v;
};
