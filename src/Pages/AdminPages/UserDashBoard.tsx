import { UserContext } from "@/Contexts/UserProvider";
import { fetcher } from "@/services/fetcher";
import { IUser } from "@/types/IUser";
import { pageTitle } from "@/utils/pageTitle";
import { Table } from "antd";
import { useContext } from "react";
import useSWR from "swr";

const UserDashBoard = () => {
  pageTitle("Người dùng - Quản trị");
  const { user } = useContext(UserContext);
  const { data: allUsers, isLoading: loadingAllUsers } = useSWR<IUser[]>(
    `/users`,
    fetcher,
  );
  console.log(`🚀 ~ UserDashBoard ~ allUsers:`, allUsers);

  return (
    <div>
      {/* Filter */}
      <div className="">Filter</div>
      {/* Data */}
      <Table></Table>
    </div>
  );
};

export default UserDashBoard;
