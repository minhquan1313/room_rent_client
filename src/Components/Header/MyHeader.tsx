// import AppLogoIcon from "@/Components/Icons/AppLogoIcon";
import ChatHeader from "@/Components/Header/ChatHeader";
import LanguageHeader from "@/Components/Header/LanguageHeader";
import ThemeSwitcher from "@/Components/Header/ThemeSwitcher";
import UserHeader from "@/Components/Header/UserHeader";
import AppLogoIcon from "@/Components/Icons/AppLogoIcon";
import MyButton from "@/Components/MyButton";
import MyContainer from "@/Components/MyContainer";
import { UserContext } from "@/Contexts/UserProvider";
import logger from "@/utils/logger";
import { Col, Row, Space, theme } from "antd";
import { Header } from "antd/es/layout/layout";
import classNames from "classnames";
import { memo, useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

const MyHeader = memo(() => {
  const { t } = useTranslation();

  const { token } = theme.useToken();
  const { user, isLogging } = useContext(UserContext);

  const location = useLocation();
  const [isAtTop, setIsAtTop] = useState(window.scrollY === 0);

  const headerClassName = useMemo(
    () =>
      classNames(
        "left-0 top-0 z-50 w-full bg-transparent p-0 transition-all duration-500",
        {
          fixed: location.pathname === "/",
          sticky: location.pathname !== "/",
        },
      ),
    [location.pathname],
  );

  useEffect(() => {
    const f = () => {
      // logger(`scroll`);

      setIsAtTop(window.scrollY === 0);
      logger(
        `🚀 ~ f ~ window.scrollY:`,
        window.scrollY,
        window.scrollY === 0,
        location.pathname,
      );
    };

    location.pathname === "/" && window.addEventListener("scroll", f);

    return () => window.removeEventListener("scroll", f);
  }, [location.pathname]);

  return (
    <Header className={headerClassName}>
      <MyContainer
      // noBg={location.pathname === "/" && isAtTop}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <Link to="/" className="flex">
              <AppLogoIcon style={{ fontSize: "2.5rem" }} />
            </Link>
          </Col>

          <Col>
            <Space>
              <ThemeSwitcher />

              <LanguageHeader />

              {user ? (
                <>
                  <ChatHeader />

                  <UserHeader />
                </>
              ) : (
                <>
                  <MyButton loading={isLogging} to="/login">
                    {isLogging
                      ? t("Register page.Signing in")
                      : t("Register page.Sign in")}
                  </MyButton>

                  <MyButton loading={isLogging} to="/register">
                    {t("Register page.Sign up")}
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
            location.pathname === "/" && isAtTop
              ? "transparent"
              : token.colorBorder,
        }}
      />
    </Header>
  );
});

export default MyHeader;
