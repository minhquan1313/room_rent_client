import { CodeMap } from "@/types/CodeMap";
import { TMeasureUnit2 } from "@/types/TMeasureUnit";

interface IMeasureUnitCode extends CodeMap {
  code: TMeasureUnit2;
  sup: string;
}

export const measureUnitCodes: IMeasureUnitCode[] = [
  {
    code: "m2",
    label: "m",
    sup: "2",
  },
  // {
  //   code: "ft2",
  //   label: "ft",
  //   sup: "2",
  // },
  // {
  //   code: "mi2",
  //   label: "mi",
  //   sup: "2",
  // },
];
