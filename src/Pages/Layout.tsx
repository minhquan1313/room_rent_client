import MyFooter from "@/Components/MyFooter";
import MyHeader from "@/Pages/MyHeader";
import { Layout, theme } from "antd";
import { Content, Footer } from "antd/es/layout/layout";
import { Outlet } from "react-router-dom";

// const API = import.meta.env.VITE_API;

function MyLayout() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  console.log(`🚀 ~ file: Layout.tsx:12 ~ MyLayout ~ token:`, theme.useToken().token);

  return (
    <Layout
      className=""
      style={{ minHeight: "100vh" }}>
      <Layout>
        <MyHeader />
        <Content style={{ background: colorBgContainer }}>
          <Outlet />
        </Content>
        <Footer style={{ textAlign: "center" }}>
          {/* Ant Design ©2023 Created by Ant UED */}
          <MyFooter />
        </Footer>
      </Layout>
    </Layout>
  );
}

export default MyLayout;
