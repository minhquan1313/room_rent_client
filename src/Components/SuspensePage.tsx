import { ReactNode, Suspense, memo } from "react";

type Props = {
  //
  children: ReactNode;
};
const SuspensePage = memo(({ children }: Props) => {
  return (
    <Suspense fallback={<div>Loading suspends...</div>}>{children}</Suspense>
  );
});

export default SuspensePage;
