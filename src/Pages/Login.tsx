import MyButton from "@/Components/MyButton";
import { UserContext } from "@/Contexts/UserContext";
import { UserLoginPayload } from "@/types/IUser";
import { pageTitle } from "@/utils/pageTitle";
import { Checkbox, Col, Form, Input, Row, Space, Typography, theme } from "antd";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type FieldType = UserLoginPayload & {
  remember: boolean;
};

function Login() {
  pageTitle("Đăng nhập");

  const navigate = useNavigate();
  const location = useLocation();

  const { user, isLogging, login } = useContext(UserContext);
  const [isFail, setIsFail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const onFinish = (values: FieldType) => {
    setIsFail(false);
    const { username, password, remember } = values;

    if (username && password) {
      const u = {
        username,
        password,
      };
      setIsSubmitting(true);
      (async () => {
        const d = await login(u, remember);

        setIsSubmitting(false);

        if (!d) {
          //login fail
          setIsFail(true);
        }
      })();
    }

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
          <Typography.Title style={{ textAlign: "center" }}>Đăng nhập</Typography.Title>
          <Form
            name="basic"
            labelCol={{ xs: { span: 7 } }}
            wrapperCol={{ span: 20 }}
            onChange={() => {
              setIsFail(false);
            }}
            disabled={isSubmitting || isLogging}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off">
            <Form.Item<FieldType>
              label="Tên đăng nhập"
              name="username"
              rules={[{ required: true, message: "Tên đăng nhập không bỏ trống" }]}>
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "Mật khẩu không bỏ trống" }]}>
              <Input.Password />
            </Form.Item>

            <Form.Item<FieldType>
              name="remember"
              valuePropName="checked"
              wrapperCol={{ offset: 8, span: 16 }}>
              <Checkbox>Ghi nhớ</Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 0, span: 0 }}>
              <Space.Compact block>
                <MyButton
                  block
                  loading={isSubmitting || isLogging}
                  type="primary"
                  danger={isFail}
                  htmlType="submit">
                  Đăng nhập
                </MyButton>
                <MyButton
                  block
                  type="default"
                  to="/register">
                  Đăng ký
                </MyButton>
              </Space.Compact>
              {isFail && <Typography.Paragraph style={{ width: "100%", textAlign: "center", marginTop: 12 }}>Đăng nhập thất bại</Typography.Paragraph>}
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
}

export default Login;
