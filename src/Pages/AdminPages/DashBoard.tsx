import ChartRoom from "@/Components/AdminPages/DashBoardStat/ChartRoom";
import NewRoomMonthCountStat from "@/Components/AdminPages/DashBoardStat/NewRoomMonthCountStat";
import NewUserMonthCountStat from "@/Components/AdminPages/DashBoardStat/NewUserMonthCountStat";
import RoomCountStat from "@/Components/AdminPages/DashBoardStat/RoomCountStat";
import UserCountStat from "@/Components/AdminPages/DashBoardStat/UserCountStat";
import VerifiedRoomCountStat from "@/Components/AdminPages/DashBoardStat/VerifiedRoomCountStat";
import { UserContext } from "@/Contexts/UserProvider";
import { pageTitle } from "@/utils/pageTitle";
import { Card } from "antd";
import { useContext } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

const columnsCountBreakPoints = {
  0: 1,
  640: 2,
  1024: 3,
  1536: 4,
};
const DashBoard = () => {
  pageTitle("Thống kê - Quản trị");
  const { user } = useContext(UserContext);

  return (
    <div className="space-y-5">
      <ResponsiveMasonry columnsCountBreakPoints={columnsCountBreakPoints}>
        <Masonry gutter="8px">
          <UserCountStat />

          <RoomCountStat />

          <NewRoomMonthCountStat />

          <NewUserMonthCountStat />

          <VerifiedRoomCountStat />
        </Masonry>
      </ResponsiveMasonry>
      {/* <ResponsiveMasonry columnsCountBreakPoints={columnsCountBreakPoints}>
        <Masonry gutter="8px"></Masonry>
      </ResponsiveMasonry> */}

      <div>
        {/* <div>Chart về số lượt truy cập hàng tuần/tháng/năm</div> */}
        <div>
          {/* Chart về số phòng đăng mỗi tuần/tháng/năm */}
          <ChartRoom />
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
