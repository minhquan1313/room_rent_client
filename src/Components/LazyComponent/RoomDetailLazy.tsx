import SuspensePage from "@/Components/SuspensePage";
import { lazy, memo } from "react";

const LazyPage = lazy(() => import("@/Pages/RoomDetail"));

const RoomDetailLazy = memo(() => {
  return (
    <SuspensePage>
      <LazyPage />
    </SuspensePage>
  );
});

export default RoomDetailLazy;
