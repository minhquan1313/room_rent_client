import { ThemeContext } from "@/Contexts/ThemeProvider";
import { UserContext } from "@/Contexts/UserProvider";
import { routeAdmin } from "@/constants/route";
import { Layout, Menu, MenuProps } from "antd";
import Sider from "antd/es/layout/Sider";
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
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
    navigate(`${[...e.keyPath].reverse().join("/")}`);
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

  useLayoutEffect(() => {
    setOpenKeys(location.pathname.split("/").slice(1));
    // if (location.pathname !== routeAdmin.index) {
    //   return;
    // }
    // typeof items?.[0]?.key === "string" && navigate(items[0]?.key);
  }, [location.pathname]);

  useEffect(() => {
    document.querySelector("#root")?.classList.add("max-h-full");
    return () => {
      document.querySelector("#root")?.classList.remove("max-h-full");
    };
  }, []);

  if (!user) return null;
  return (
    <div className="flex h-full">
      <Layout hasSider>
        {/* <div className="flex w-full"> */}
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

      <div className="relative h-full w-full overflow-x-hidden px-5">
        <Outlet />
      </div>
    </div>
  );
};

export default LayoutAdmin;
