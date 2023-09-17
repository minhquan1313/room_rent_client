// import AppLogoIcon from "@/Components/Icons/AppLogoIcon";
import MyButton from "@/Components/MyButton";
import MyContainer from "@/Components/MyContainer";
import ThemeSwitcher from "@/Components/ThemeSwitcher";
import UserHeader from "@/Components/UserHeader";
import { UserContext } from "@/Contexts/UserProvider";
import { ReactComponent as AppLogoIcon } from "@/assets/appLogo.svg";
import { Col, Row, Space, theme } from "antd";
import { Header } from "antd/es/layout/layout";
import classNames from "classnames";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function MyHeader() {
  const { token } = theme.useToken();
  const { user, isLogging } = useContext(UserContext);

  const location = useLocation();
  const [scrollY, setScrollY] = useState(window.scrollY);

  useEffect(() => {
    const f = () => {
      // console.log(`scroll`);

      setScrollY(window.scrollY);
    };

    location.pathname === "/" && window.addEventListener("scroll", f);

    return () => window.removeEventListener("scroll", f);
  }, [location.pathname]);

  return (
    <Header
      className={classNames(
        "left-0 top-0 z-50 w-full bg-transparent p-0 transition-all duration-500",
        {
          fixed: location.pathname === "/",
          sticky: location.pathname !== "/",
        },
      )}
      // style={{
      //   backgroundImage: `linear-gradient(to bottom, ${token.colorBgContainer}, transparent)`,
      //   zIndex: 123,
      // }}
    >
      <MyContainer noBg={location.pathname === "/" && scrollY === 0}>
        <Row justify="space-between" align="middle">
          <Col>
            <Link to="/" className="flex">
              <AppLogoIcon width={40} height={40} />
            </Link>
          </Col>

          <Col>
            <Space>
              <ThemeSwitcher />

              {user ? (
                <UserHeader />
              ) : (
                <>
                  <MyButton loading={isLogging} to="/login">
                    {isLogging ? "Đang đăng nhập" : "Đăng nhập"}
                  </MyButton>

                  <MyButton loading={isLogging} to="/register">
                    Đăng ký
                  </MyButton>
                </>
              )}
            </Space>
          </Col>
        </Row>
      </MyContainer>
      <div
        className="absolute bottom-0 h-[1px] w-full bg-emerald-300"
        style={{
          backgroundColor:
            location.pathname === "/" && scrollY === 0
              ? "transparent"
              : token.colorBorder,
        }}
      />
    </Header>
  );
}
