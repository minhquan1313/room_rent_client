import SuspensePage from "@/Components/SuspensePage";
import { lazy, memo } from "react";

const LazyPage = lazy(() => import("@/Pages/AdminPages/DashBoard"));

const DashBoardLazy = memo(() => {
  return (
    <SuspensePage>
      <LazyPage />
    </SuspensePage>
  );
});

export default DashBoardLazy;
