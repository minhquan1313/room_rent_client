import SuspensePage from "@/Components/SuspensePage";
import { lazy, memo } from "react";

const LazyPage = lazy(() => import("@/Pages/AdminPages/AllRoomDashBoard"));

const AllRoomDashBoardLazy = memo(() => {
  return (
    <SuspensePage>
      <LazyPage />
    </SuspensePage>
  );
});

export default AllRoomDashBoardLazy;
