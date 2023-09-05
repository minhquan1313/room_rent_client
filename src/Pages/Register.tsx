import MyButton from "@/Components/MyButton";
import { UserContext } from "@/Contexts/UserContext";
import { UserRegisterPayload } from "@/types/IUser";
import { pageTitle } from "@/utils/pageTitle";
import { Col, Form, Input, Row, Space, Typography, theme } from "antd";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Register() {
  pageTitle("Đăng ký");

  const navigate = useNavigate();
  const location = useLocation();

  const { user, isLogging, register } = useContext(UserContext);
  const [loginFail, setLoginFail] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const onFinish = (values: UserRegisterPayload) => {
    setLoginFail(false);
    const u: UserRegisterPayload = values;
    setLoading(true);
    (async () => {
      const d = await register(u, true);
      setLoading(false);

      if (d) {
        // login success
      } else {
        setLoginFail(true);
        //login fail
      }
    })();

    console.log("Success:", values);
  };

  // if user already logged in
  useEffect(() => {
    if (!user) return;

    if (location.key === "default") navigate("/");
    else navigate(-1);
  });

  // when user press go back but not login
  useEffect(() => {
    const f = (e: PopStateEvent): void => {
      e.preventDefault();

      if (location.key === "default") navigate("/");
      else navigate(-2);
    };
    window.addEventListener("popstate", f);

    return () => {
      window.removeEventListener("popstate", f);
    };
  }, []);

  return (
    <div style={{ position: "relative", backgroundColor: colorBgContainer }}>
      <Row
        justify={"center"}
        align={"middle"}
        style={{ height: "100vh" }}>
        <Col
          xs={{ span: 18 }}
          md={{ span: 12 }}
          lg={{ span: 10 }}
          xxl={{ span: 6 }}>
          <Typography.Title style={{ textAlign: "center" }}>Đăng ký</Typography.Title>
          <Form
            name="basic"
            labelCol={{ xs: { span: 7 } }}
            wrapperCol={{ span: 20 }}
            onChange={() => {
              setLoginFail(false);
            }}
            disabled={loading || isLogging}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off">
            <Form.Item<UserRegisterPayload>
              label="Tên đăng nhập"
              name="username"
              rules={[{ required: true, message: "Tên đăng nhập không bỏ trống" }]}>
              <Input />
            </Form.Item>

            <Form.Item<UserRegisterPayload>
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "Mật khẩu không bỏ trống" }]}>
              <Input.Password />
            </Form.Item>

            <Form.Item<UserRegisterPayload>
              label="Họ và tên đệm"
              name="last_name">
              <Input />
            </Form.Item>

            <Form.Item<UserRegisterPayload>
              label="Tên"
              name="first_name"
              rules={[{ required: true, message: "Tên  không bỏ trống" }]}>
              <Input />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 0, span: 0 }}>
              <Space.Compact block>
                <MyButton
                  block
                  loading={isLogging}
                  type="default"
                  to="/login">
                  Đăng nhập
                </MyButton>
                <MyButton
                  block
                  type="primary"
                  loading={loading}
                  danger={loginFail}
                  htmlType="submit">
                  Đăng ký
                </MyButton>
              </Space.Compact>
              {loginFail && <Typography.Paragraph style={{ width: "100%", textAlign: "center", marginTop: 12 }}>Đăng ký thất bại</Typography.Paragraph>}
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
}

export default Register;
