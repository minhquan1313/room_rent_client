import SuspensePage from "@/Components/SuspensePage";
import { lazy, memo } from "react";

const LazyPage = lazy(() => import("@/Pages/RoomAdd"));

const AddRoomLazy = memo(() => {
  return (
    <SuspensePage>
      <LazyPage />
    </SuspensePage>
  );
});

export default AddRoomLazy;
