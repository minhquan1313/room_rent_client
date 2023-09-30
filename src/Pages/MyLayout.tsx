import MyFooter from "@/Components/MyFooter";
import MyHeader from "@/Components/MyHeader";
import { theme } from "antd";
import { Content } from "antd/es/layout/layout";
import { Outlet } from "react-router-dom";

function MyLayout() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <div className="flex min-h-full min-w-full flex-col">
      <MyHeader />
      <Content className="flex-1" style={{ background: colorBgContainer }}>
        <Outlet />
      </Content>
      <MyFooter />
    </div>
  );
}

export default MyLayout;
