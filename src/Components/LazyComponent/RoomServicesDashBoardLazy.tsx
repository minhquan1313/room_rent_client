import SuspensePage from "@/Components/SuspensePage";
import { lazy, memo } from "react";

const LazyPage = lazy(() => import("@/Pages/AdminPages/RoomServicesDashBoard"));

const RoomServicesDashBoardLazy = memo(() => {
  return (
    <SuspensePage>
      <LazyPage />
    </SuspensePage>
  );
});

export default RoomServicesDashBoardLazy;
