import { removeAccents } from "@/utils/removeAccents";
import { ReactNode } from "react";

export function searchFilterTextHasLabel(
  input: string,
  option?: {
    key?: string;
    label?: ReactNode;
    value?: string | number | null;
  },
) {
  if (!option?.label || typeof option.label !== "string") return false;

  return removeAccents(option.label)
    .toLowerCase()
    .includes(removeAccents(input).toLowerCase());
}
