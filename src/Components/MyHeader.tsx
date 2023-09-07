import MyButton from "@/Components/MyButton";
import MyContainer from "@/Components/MyContainer";
import ThemeSwitcher from "@/Components/ThemeSwitcher";
import { UserContext } from "@/Contexts/UserContext";
import { fetcher } from "@/services/fetcher";
import { preloadImage } from "@/utils/preloadImage";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Col, Row, Space, Spin, Tooltip, message, theme } from "antd";
import { Header } from "antd/es/layout/layout";
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
                <>
                  <Spin spinning={isUploading || !isImagePreloaded}>
                    <Tooltip title="Bấm để thay avatar">
                      <Avatar
                        // size="large"
                        src={user.image}
                        icon={<UserOutlined />}
                        onClick={() => {
                          (() => {
                            const input = document.createElement("input");
                            input.type = "file";
                            input.accept = "image/*";

                            input.onchange = () => imageUploadSubmit(input);

                            input.click();
                          })();
                        }}
                      />
                    </Tooltip>
                  </Spin>

                  <MyButton>
                    {user.last_name} {user.first_name}
                  </MyButton>
                  <MyButton onClick={logout}>Đăng xuất</MyButton>
                </>
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
