import MyAvatar from "@/Components/MyAvatar";
import { UserContext } from "@/Contexts/UserProvider";
import { isRoleAdmin, isRoleOwner } from "@/constants/roleType";
import {
  routeAdmin,
  routeFavoriteRoom,
  routeRoomAdd,
  routeUserDetail,
} from "@/constants/route";
import { toStringUserName } from "@/utils/toString";
import { LogoutOutlined } from "@ant-design/icons";
import { Badge, Dropdown, Space } from "antd";
import classNames from "classnames";
import { useContext } from "react";
import { Link } from "react-router-dom";

const UserHeader = () => {
  const { user, logout } = useContext(UserContext);

  if (!user) return null;

  return (
    <Dropdown
      menu={{
        items: [
          isRoleAdmin(user.role?.title)
            ? {
                key: routeAdmin.index,
                label: (
                  <Link to={`${routeAdmin.index}/${routeAdmin.stats}`}>
                    Dashboard
                  </Link>
                ),
              }
            : null,
          {
            key: "/info",
            label: (
              <Link
                to={`${routeUserDetail}/${user._id}`}
                state={{
                  user,
                }}
              >
                <Space>
                  {toStringUserName(user)}

                  {isRoleOwner(user.role?.title) && (
                    <Badge
                      // title={user.role?.display_name ?? ""}
                      color="cyan"
                      count={user.role?.display_name}
                    />
                  )}
                </Space>
              </Link>
            ),
            disabled: false,
          },
          isRoleOwner(user.role?.title)
            ? {
                key: routeRoomAdd,
                label: <Link to={routeRoomAdd}>Thêm phòng</Link>,
              }
            : null,
          {
            key: "/favorite",
            label: <Link to={routeFavoriteRoom}>Đã lưu</Link>,
          },
          {
            type: "divider",
          },
          {
            key: "logout",
            icon: <LogoutOutlined />,
            label: "Đăng xuất",
            disabled: false,
            onClick: logout,
          },
        ],
      }}
      className="cursor-pointer"
      arrow
      autoAdjustOverflow
      // trigger={["click"]}
      // open={true}
    >
      <MyAvatar
        className={classNames("select-none", {
          "border-2 border-solid border-yellow-500": isRoleAdmin(
            user.role?.title,
          ),
        })}
        src={user.image}
        addServer
        alt={user.first_name[0]}
        size="large"
      />
    </Dropdown>
  );
};

export default UserHeader;
