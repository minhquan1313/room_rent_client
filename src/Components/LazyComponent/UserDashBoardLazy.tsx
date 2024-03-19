import SuspensePage from "@/Components/SuspensePage";
import { lazy } from "react";

const LazyPage = lazy(() => import("@/Pages/AdminPages/UserDashBoard"));

const UserDashBoardLazy = () => {
  return (
    <SuspensePage>
      <LazyPage />
    </SuspensePage>
  );
};

export default UserDashBoardLazy;
