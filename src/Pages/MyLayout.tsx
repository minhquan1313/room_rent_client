import MyFooter from "@/Components/MyFooter";
import MyHeader from "@/Components/MyHeader";
import { theme } from "antd";
import { Content, Footer } from "antd/es/layout/layout";
import { Outlet } from "react-router-dom";

// const API = import.meta.env.VITE_API;

function MyLayout() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <div className="flex min-h-full min-w-full flex-col">
      <MyHeader />
      <Content
        className="flex-1 overflow-hidden"
        style={{ background: colorBgContainer }}
      >
        <Outlet />
      </Content>

      {/* <MyContainer outerClassName="flex-1">
        <Outlet />
      </MyContainer> */}
      <Footer style={{ textAlign: "center" }}>
        {/* Ant Design ©2023 Created by Ant UED */}
        <MyFooter />
      </Footer>
    </div>
  );
}

export default MyLayout;
