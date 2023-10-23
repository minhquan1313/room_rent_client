import { pageTitle } from "@/utils/pageTitle";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}
function Empty({ children }: Props) {
  pageTitle("");

  return <div className="">{children}</div>;
}

export default Empty;
