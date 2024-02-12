import SuspensePage from "@/Components/SuspensePage";
import { lazy, memo } from "react";

const LazyPage = lazy(() => import("@/Pages/AdminPages/RoomTypesDashBoard"));

const RoomTypesDashBoardLazy = memo(() => {
  return (
    <SuspensePage>
      <LazyPage />
    </SuspensePage>
  );
});

export default RoomTypesDashBoardLazy;
