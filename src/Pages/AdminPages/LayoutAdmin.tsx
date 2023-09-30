import { ThemeContext } from "@/Contexts/ThemeProvider";
import { UserContext } from "@/Contexts/UserProvider";
import { routeAdmin } from "@/constants/route";
import { Layout, Menu, MenuProps } from "antd";
import Sider from "antd/es/layout/Sider";
import { useContext, useLayoutEffect, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const LayoutAdmin = () => {
  const { user } = useContext(UserContext);
  const { myTheme } = useContext(ThemeContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  const [openKeys, setOpenKeys] = useState<string[]>(
    location.pathname.split("/").slice(1),
  );

  const menuClick: MenuProps["onClick"] = (e) => {
    console.log(`🚀 ~ LayoutAdmin ~ e:`, e);
    navigate(`${e.keyPath.reverse().join("/")}`);
  };
  const items = useMemo<MenuProps["items"]>(
    () => [
      {
        key: routeAdmin.stats,
        label: "Thống kê",
      },
      {
        key: routeAdmin.user,
        label: "Người dùng",
      },
      {
        key: routeAdmin.room,
        label: "Phòng trọ",
        children: [
          {
            key: routeAdmin.roomList,
            label: "Tất cả",
          },
          {
            key: routeAdmin.roomService,
            label: "Dịch vụ",
          },
          {
            key: routeAdmin.roomType,
            label: "Kiểu phòng",
          },
        ],
      },
    ],
    [],
  );
  openKeys;
  console.log(`🚀 ~ LayoutAdmin ~ openKeys:`, openKeys);

  useLayoutEffect(() => {
    setOpenKeys(location.pathname.split("/").slice(1));
    // if (location.pathname !== routeAdmin.index) {
    //   return;
    // }
    // typeof items?.[0]?.key === "string" && navigate(items[0]?.key);
  }, [location.pathname]);

  if (!user) return null;

  return (
    <div className="flex min-h-full">
      <Layout className="flex-grow-0">
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={toggleCollapsed}
          theme={myTheme}
        >
          <Menu
            onClick={menuClick}
            defaultSelectedKeys={openKeys}
            defaultOpenKeys={openKeys}
            // openKeys={openKeys.current}
            // selectedKeys={openKeys.current}
            mode="inline"
            theme={myTheme}
            items={items}
          />
        </Sider>
      </Layout>
      <div className="flex-1 flex-shrink-0">
        <Outlet />
      </div>
    </div>
  );
};

export default LayoutAdmin;
