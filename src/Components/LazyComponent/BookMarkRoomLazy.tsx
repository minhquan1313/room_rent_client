import SuspensePage from "@/Components/SuspensePage";
import { lazy } from "react";

const LazyPage = lazy(() => import("@/Pages/BookMarkRoom"));

const BookMarkRoomLazy = () => {
  return (
    <SuspensePage>
      <LazyPage />
    </SuspensePage>
  );
};

export default BookMarkRoomLazy;
