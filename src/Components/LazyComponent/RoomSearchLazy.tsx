import SuspensePage from "@/Components/SuspensePage";
import { lazy } from "react";

const LazyPage = lazy(() => import("@/Pages/RoomSearch"));

const RoomSearchLazy = () => {
  return (
    <SuspensePage>
      <LazyPage />
    </SuspensePage>
  );
};

export default RoomSearchLazy;
