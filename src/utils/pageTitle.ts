import { VITE_APP_NAME } from "@/constants/env";

const a = VITE_APP_NAME ?? "";

// let currentTitle: string | undefined = a;
export const pageSeparator = " - ";

export function pageTitle(title: string) {
  const tit = title ? `${title}${pageSeparator}${a}` : a;

  // document.title = tit;
  setTimeout(() => {
    document.title = tit;
  }, 100);

  document.title = tit;

  return;
}
