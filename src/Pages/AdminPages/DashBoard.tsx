import { UserContext } from "@/Contexts/UserProvider";
import { pageTitle } from "@/utils/pageTitle";
import { useContext } from "react";

const DashBoard = () => {
  pageTitle("Quản trị");
  const { user } = useContext(UserContext);

  return <>Hi</>;
};

export default DashBoard;
