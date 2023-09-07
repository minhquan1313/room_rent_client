import MyButton from "@/Components/MyButton";
import MyContainer from "@/Components/MyContainer";
import ThemeSwitcher from "@/Components/ThemeSwitcher";
import { UserContext } from "@/Contexts/UserContext";
import { ADMIN_ROLES, OWNER_ROLES } from "@/config/roleType";
import { fetcher } from "@/services/fetcher";
import { userNameDisplay } from "@/utils/dataDisplay";
import { preloadImage } from "@/utils/preloadImage";
import { LogoutOutlined } from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Col,
  Dropdown,
  Row,
  Space,
  Spin,
  message,
  theme,
} from "antd";
import { Header } from "antd/es/layout/layout";
import classNames from "classnames";
import { useContext, useEffect, useState } from "react";

export default function MyHeader() {
  const { token } = theme.useToken();
  const { user, isLogging, logout, refresh } = useContext(UserContext);
  const [isUploading, setIsUploading] = useState(false);
  const [isImagePreloaded, setIsImagePreloaded] = useState(true);

  const imageUploadSubmit = async (e: HTMLInputElement): Promise<void> => {
    const file = e.files?.[0];

    if (!user || !file) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await fetcher.patchForm(`/users/image/${user._id}`, {
        file,
      });
      message.success(`Tải ảnh thành công`);

      setIsImagePreloaded(false);
      refresh();
    } catch (error) {
      message.error(`Tải ảnh thất bại, thử lại sau`);
    }

    setIsUploading(false);
  };

  useEffect(() => {
    if (!user?.image) return;

    setIsImagePreloaded(false);

    preloadImage(user.image).then(() => setIsImagePreloaded(true));
  }, [user?.image]);

  return (
    <Header className="bg-transparent p-0">
      <MyContainer
      // style={{ backgroundColor: token.colorBgSpotlight }}
      >
        <Row justify="space-between">
          <Col></Col>

          <Col>
            <Space>
              <ThemeSwitcher />

              {user ? (
                <Spin spinning={isUploading || !isImagePreloaded}>
                  <Dropdown
                    className="cursor-pointer"
                    menu={{
                      items: [
                        {
                          key: "info",
                          label: (
                            <MyButton to="/info" rawTo>
                              <Space>
                                {userNameDisplay(user)}
                                {[...ADMIN_ROLES, ...OWNER_ROLES].includes(
                                  user.role.title,
                                ) && (
                                  <Badge
                                    title={user.role.display_name ?? ""}
                                    size="default"
                                    // count={3}
                                    color="cyan"
                                    count={user.role.display_name}
                                  />
                                )}
                              </Space>
                            </MyButton>
                          ),
                          disabled: false,
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
                    arrow
                    autoAdjustOverflow
                    // open={true}
                  >
                    <Avatar
                      size="large"
                      src={user.image}
                      className={classNames("select-none", {
                        "border-2 border-solid border-yellow-500":
                          ADMIN_ROLES.includes(user.role.title),
                      })}
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
                      {user.first_name[0]}
                    </Avatar>
                  </Dropdown>
                </Spin>
              ) : (
                <>
                  <MyButton loading={isLogging} to="/login">
                    {isLogging ? "Đang đăng nhập" : "Đăng nhập"}
                  </MyButton>

                  <MyButton loading={isLogging} to="/register">
                    Đăng ký
                  </MyButton>
                </>
              )}
            </Space>
          </Col>
        </Row>
      </MyContainer>
    </Header>
  );
}
