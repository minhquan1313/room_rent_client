import MoonIcon from "@/Components/Icons/MoonIcon";
import MyButton from "@/Components/MyButton";
import { ThemeContext } from "@/Contexts/ThemeProvider";
import { UserContext } from "@/Contexts/UserContext";
import { SearchOutlined } from "@ant-design/icons";
import { Col, Dropdown, Row, Space, theme } from "antd";
import { Header } from "antd/es/layout/layout";
import { useContext } from "react";

export default function MyHeader() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { user, isLogging, logout } = useContext(UserContext);

  const { myTheme, switchTheme } = useContext(ThemeContext);
  // const [isUploading, setIsUploading] = useState(false);
  // const [isImagePreloaded, setIsImagePreloaded] = useState(true);
  // const imageUploadSubmit = async (e: HTMLInputElement): Promise<void> => {
  //   const file = e.files?.[0];
  //   if (!user || !file) return;
  //   const formData = new FormData();
  //   formData.append("file", file);
  //   formData.append("userId", user.id.toString());
  //   setIsUploading(true);
  //   setIsImagePreloaded(false);
  //   const res = await fetch(`${API}/avatar/`, {
  //     method: "POST",
  //     body: formData,
  //   });
  //   console.log({ res });
  //   const data = (await res.json()) as { url?: string };
  //   const { url } = data;
  //   console.log({ url });
  //   if (url) {
  //     message.success(`Tải ảnh thành công`);
  //     preloadImage(url, () => {
  //       setIsImagePreloaded(true);
  //       setUserAvatar(url);
  //     });
  //   } else {
  //     message.error(`Tải ảnh thất bại, thử lại sau`);
  //   }
  //   setIsUploading(false);
  // };
  return (
    <Header style={{ padding: 0, background: colorBgContainer }}>
      <Row
        justify="space-between"
        style={{ padding: "0 12px" }}>
        <Col></Col>

        <Col>
          <Space>
            <Dropdown
              menu={{
                items: [
                  {
                    key: "1",
                    label: (
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://www.antgroup.com">
                        1st menu item
                      </a>
                    ),
                  },
                  {
                    key: "2",
                    label: (
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://www.aliyun.com">
                        2nd menu item
                      </a>
                    ),
                  },
                  {
                    key: "3",
                    label: (
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://www.luohanacademy.com">
                        3rd menu item
                      </a>
                    ),
                  },
                ],
              }}
              placement="bottom">
              <MyButton
                type="primary"
                shape="circle"
                size="large"
                icon={myTheme === "dark" ? <MoonIcon /> : <SearchOutlined />}
              />
            </Dropdown>

            {user ? (
              <>
                {/* <Spin spinning={isUploading || isLogging || !isImagePreloaded}>
                      <Tooltip title="Bấm để thay avatar">
                        <Avatar
                          size="large"
                          src={user.avatar}
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
                      {user.lastName} {user.firstName}
                    </MyButton> */}
                <MyButton onClick={logout}>Đăng xuất</MyButton>
              </>
            ) : (
              <MyButton
                loading={isLogging}
                to="/login">
                {isLogging ? "Đang đăng nhập" : "Đăng nhập"}
              </MyButton>
            )}
          </Space>
        </Col>
      </Row>
    </Header>
  );
}
