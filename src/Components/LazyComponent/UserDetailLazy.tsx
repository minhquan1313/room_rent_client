import SuspensePage from "@/Components/SuspensePage";
import { lazy } from "react";

const LazyPage = lazy(() => import("@/Pages/UserDetail"));

const UserDetailLazy = () => {
  return (
    <SuspensePage>
      <LazyPage />
    </SuspensePage>
  );
};

export default UserDetailLazy;
