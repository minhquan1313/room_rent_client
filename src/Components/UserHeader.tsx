import MyImage from "@/Components/MyImage";
import { UserContext } from "@/Contexts/UserProvider";
import { isRoleAdmin, isRoleOwner } from "@/constants/roleType";
import { routeRoomAdd, routeUserDetail } from "@/constants/route";
import { toStringUserName } from "@/utils/toString";
import { LogoutOutlined } from "@ant-design/icons";
import { Avatar, Badge, Dropdown, Space, Spin } from "antd";
import classNames from "classnames";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";

const UserHeader = () => {
  const { user, logout } = useContext(UserContext);
  const [isUploading, setIsUploading] = useState(false);
  const [isImagePreloaded, setIsImagePreloaded] = useState(true);

  // const imageUploadSubmit = async (e: HTMLInputElement): Promise<void> => {
  //   const file = e.files?.[0];

  //   if (!user || !file) return;
  //   setIsUploading(true);

  //   const formData = new FormData();
  //   formData.append("file", file);

  //   try {
  //     await fetcher.patchForm(`/users/image/${user._id}`, {
  //       file,
  //     });
  //     message.success(`Tải ảnh thành công`);

  //     setIsImagePreloaded(false);
  //     refresh();
  //   } catch (error) {
  //     message.error(`Tải ảnh thất bại, thử lại sau`);
  //   }

  //   setIsUploading(false);
  // };

  // useEffect(() => {
  //   if (!user?.image) return;

  //   setIsImagePreloaded(false);

  //   preloadImage({
  //     url: user.image,
  //     addServer: true,
  //   }).then(() => setIsImagePreloaded(true));
  // }, [user?.image]);

  if (!user) return null;

  return (
    <Spin spinning={isUploading || !isImagePreloaded}>
      <Dropdown
        menu={{
          items: [
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

                    {isRoleOwner(user.role.title) && (
                      <Badge
                        // title={user.role.display_name ?? ""}
                        color="cyan"
                        count={user.role.display_name}
                      />
                    )}
                  </Space>
                </Link>
              ),
              disabled: false,
            },
            isRoleOwner(user.role.title)
              ? {
                  key: routeRoomAdd,
                  label: <Link to={routeRoomAdd}>Thêm phòng</Link>,
                  disabled: !isRoleOwner(user.role.title),
                }
              : null,
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
        <Avatar
          className={classNames("select-none", {
            "border-2 border-solid border-yellow-500": isRoleAdmin(
              user.role.title,
            ),
          })}
          size="large"
          src={
            user.image && (
              <MyImage
                className="aspect-square object-cover"
                src={user.image}
                addServer
                preview={false}
              />
            )
          }

          // icon={<UserOutlined />}
          // onClick={() => {
          //   (() => {
          //     const input = document.createElement("input");
          //     input.type = "file";
          //     input.accept = "image/*";

          //     input.onchange = () => imageUploadSubmit(input);

          //     input.click();
          //   })();
          // }}
        >
          {/* {user.username} */}
          {user.first_name[0]}
        </Avatar>
        {/* </Link> */}
      </Dropdown>
    </Spin>
  );
};

export default UserHeader;
