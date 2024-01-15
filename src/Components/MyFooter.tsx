import { routeAdmin, routeChat } from "@/constants/route";
import { Footer } from "antd/es/layout/layout";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

const ROUTES = [routeAdmin.index, routeChat];
export default function MyFooter() {
  const { t } = useTranslation();
  const location = useLocation();

  if (ROUTES.find((route) => location.pathname.startsWith(route))) return null;
  // if (ROUTES.includes(location.pathname, 0)) return null;

  return (
    <Footer style={{ textAlign: "center" }}>
      {/* Ant Design ©2023 Created by Ant UED */}
      <div>
        <p>{t("home page.Project to build a website to find accommodation")}</p>
      </div>
    </Footer>
  );
}
