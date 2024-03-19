import { Formatter } from "i18next";

export type TI18nFormatter = Parameters<Formatter["add"]>["1"];
