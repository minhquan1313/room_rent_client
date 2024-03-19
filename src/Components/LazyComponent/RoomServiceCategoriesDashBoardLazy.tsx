import SuspensePage from "@/Components/SuspensePage";
import { lazy } from "react";

const LazyPage = lazy(
  () => import("@/Pages/AdminPages/RoomServiceCategoriesDashBoard"),
);

const RoomServiceCategoriesDashBoardLazy = () => {
  return (
    <SuspensePage>
      <LazyPage />
    </SuspensePage>
  );
};

export default RoomServiceCategoriesDashBoardLazy;
