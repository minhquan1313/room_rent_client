import SuspensePage from "@/Components/SuspensePage";
import { lazy, memo } from "react";

const LazyPage = lazy(
  () => import("@/Pages/AdminPages/RoomServiceCategoriesDashBoard"),
);

const RoomServiceCategoriesDashBoardLazy = memo(() => {
  return (
    <SuspensePage>
      <LazyPage />
    </SuspensePage>
  );
});

export default RoomServiceCategoriesDashBoardLazy;
