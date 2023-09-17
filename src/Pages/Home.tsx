import { HomeSearch } from "@/Components/HomeSearch";
import MyButton from "@/Components/MyButton";
import MyContainer from "@/Components/MyContainer";
import MyImage from "@/Components/MyImage";
import { PopularProvinces } from "@/Components/PopularProvinces";
import { RecentRooms } from "@/Components/RecentRooms";
import { ThemeContext } from "@/Contexts/ThemeProvider";
import banner from "@/assets/images/pexels-pixabay-277787.jpg";
import { isProduction } from "@/utils/isProduction";
import { pageTitle } from "@/utils/pageTitle";
import { Divider, Space, Typography } from "antd";
import classNames from "classnames";
import { useContext } from "react";

function Home() {
  pageTitle("Trang chủ");

  const { myTheme } = useContext(ThemeContext);

  return (
    <>
      <div className="relative">
        <div className="relative">
          <MyImage
            // src={
            // "https://images.pexels.com/photos/463734/pexels-photo-463734.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            // }
            src={banner}
            className="max-h-[40rem] object-cover"
            width={"100%"}
            height={"40rem"}
            preview={false}
          />
          <div
            className={classNames("absolute inset-0 block bg-gradient-to-b", {
              "from-black/50": myTheme === "dark",
              "from-black/25": myTheme === "light",
            })}
          />
        </div>

        <MyContainer
          className="absolute inset-0 flex items-center justify-center"
          noBg
        >
          <Typography.Title
            level={1}
            style={{ textAlign: "center", paddingTop: 20 }}
            className="!text-white"
          >
            TRỌ MỚI TOÀN QUỐC
          </Typography.Title>
          {/* <HomeSearch /> */}
        </MyContainer>

        <MyContainer noBg className="absolute bottom-5">
          <HomeSearch />
        </MyContainer>
      </div>

      {!isProduction && (
        <MyContainer className="mt-10">
          <Space>
            [DEV]
            <MyButton to="/rooms/add">Thêm phòng</MyButton>
          </Space>
        </MyContainer>
      )}

      <MyContainer className="mt-10">
        <Divider orientation="left">
          <Typography.Title level={3}>Đăng gần đây</Typography.Title>
        </Divider>
        <RecentRooms />
      </MyContainer>

      <MyContainer className="my-10">
        <Divider orientation="left">
          <Typography.Title level={3}>TỈNH/THÀNH PHỐ NỔI BẬT</Typography.Title>
        </Divider>
        <PopularProvinces />
      </MyContainer>
    </>
  );
}

export default Home;
