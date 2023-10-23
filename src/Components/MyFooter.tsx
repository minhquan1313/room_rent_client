import { routeAdmin, routeChat } from "@/constants/route";
import { Footer } from "antd/es/layout/layout";
import { useLocation } from "react-router-dom";

const ROUTES = [routeAdmin.index, routeChat];
export default function MyFooter() {
  const location = useLocation();

  if (ROUTES.find((route) => location.pathname.startsWith(route))) return null;
  // if (ROUTES.includes(location.pathname, 0)) return null;

  return (
    <Footer style={{ textAlign: "center" }}>
      {/* Ant Design ©2023 Created by Ant UED */}
      <div>
        <p>Đồ án xây dựng website tìm nhà trọ</p>
      </div>
    </Footer>
  );
}
