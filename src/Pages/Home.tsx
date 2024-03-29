import { HomeSearch } from "@/Components/HomeSearch";
import MyContainer from "@/Components/MyContainer";
import MyImage from "@/Components/MyImage";
import { PopularProvinces } from "@/Components/PopularProvinces";
import { RecentRooms } from "@/Components/RecentRooms";
import { ThemeContext } from "@/Contexts/ThemeProvider";
import banner from "@/assets/images/pexels-pixabay-277787.jpg";
import { pageTitle } from "@/utils/pageTitle";
import { Divider, Typography } from "antd";
import classNames from "classnames";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

function Home() {
  const { t } = useTranslation();

  pageTitle(t("page name.home"));

  const { myTheme } = useContext(ThemeContext);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
  }, []);
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
            {t("home page.New boarding house nationwide")}
          </Typography.Title>
          {/* <HomeSearch /> */}
        </MyContainer>

        <MyContainer noBg className="absolute bottom-5">
          <HomeSearch />
        </MyContainer>
      </div>

      {/* {!isProduction && (
        <MyContainer className="mt-10">
          <Space>
            [DEV]
            <MyButton to={routeRoomAdd}>Thêm phòng</MyButton>
          </Space>
        </MyContainer>
      )} */}

      <MyContainer className="mt-10 overflow-hidden">
        <Divider orientation="left">
          <Typography.Title level={3}>
            {t("home page.Recently posted")}
          </Typography.Title>
        </Divider>
        <RecentRooms />
      </MyContainer>

      <MyContainer className="my-10 overflow-hidden">
        <Divider orientation="left">
          <Typography.Title level={3}>
            {t("home page.Featured Province/City")}
          </Typography.Title>
        </Divider>
        <PopularProvinces />
      </MyContainer>
    </>
  );
}

export default Home;
