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
import { Dropdown, Space } from "antd";
import classNames from "classnames";
import { useContext } from "react";
import { Link } from "react-router-dom";

import UserRoleBadge from "@/Components/UserRoleBadge";
import { memo } from "react";
import { useTranslation } from "react-i18next";

const UserHeader = memo(() => {
  const { t } = useTranslation();

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
                    {t("Drop down.User nav btn.Dashboard")}
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

                  {user.role && isRoleOwner(user.role?.title) && (
                    <UserRoleBadge role={user.role} />
                  )}
                </Space>
              </Link>
            ),
            disabled: false,
          },
          isRoleOwner(user.role?.title)
            ? {
                key: routeRoomAdd,
                label: (
                  <Link to={routeRoomAdd}>
                    {t("Drop down.User nav btn.Add room")}
                  </Link>
                ),
              }
            : null,
          {
            key: "/favorite",
            label: (
              <Link to={routeFavoriteRoom}>
                {t("Drop down.User nav btn.Saved")}
              </Link>
            ),
          },
          {
            type: "divider",
          },
          {
            key: "logout",
            icon: <LogoutOutlined />,
            label: t("Drop down.User nav btn.Sign out"),
            disabled: false,
            onClick: logout,
          },
        ],
      }}
      className="cursor-pointer"
      arrow
      autoAdjustOverflow
      trigger={["click"]}
      placement="bottomRight"
    >
      <MyAvatar
        className={classNames("select-none", {
          "border-2 border-solid border-yellow-500": isRoleAdmin(
            user.role?.title,
          ),
        })}
        src={user.image}
        addServer
        name={user.first_name}
        size="large"
      />
    </Dropdown>
  );
});

export default UserHeader;
