import SuspensePage from "@/Components/SuspensePage";
import { lazy } from "react";

const LazyPage = lazy(() => import("@/Pages/AdminPages/AllRoomDashBoard"));

const AllRoomDashBoardLazy = () => {
  return (
    <SuspensePage>
      <LazyPage />
    </SuspensePage>
  );
};

export default AllRoomDashBoardLazy;
