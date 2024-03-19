import SuspensePage from "@/Components/SuspensePage";
import { lazy } from "react";

const LazyPage = lazy(() => import("@/Pages/AdminPages/RoomServicesDashBoard"));

const RoomServicesDashBoardLazy = () => {
  return (
    <SuspensePage>
      <LazyPage />
    </SuspensePage>
  );
};

export default RoomServicesDashBoardLazy;
