import MyButton from "@/Components/MyButton";
import MyContainer from "@/Components/MyContainer";
import { UserContext } from "@/Contexts/UserContext";
import { ErrorJsonResponse } from "@/types/ErrorJsonResponse";

import { UserLoginPayload } from "@/types/IUser";
import { pageTitle } from "@/utils/pageTitle";
import { Alert, Checkbox, Form, Input, Space, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type TUserLoginPayload = UserLoginPayload & {
  remember: boolean;
};

function Login() {
  pageTitle("Đăng nhập");

  const navigate = useNavigate();
  const location = useLocation();

  const { user, isLogging, login } = useContext(UserContext);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<ErrorJsonResponse>();

  const onFinish = (values: TUserLoginPayload) => {
    setError(undefined);
    setSubmitting(true);
    const { remember } = values;

    (async () => {
      try {
        const d = await login(values, remember);
      } catch (error: any) {
        console.log(`🚀 ~ error:`, error);

        setError(error.response.data as ErrorJsonResponse);
      }
    })();
    setSubmitting(false);
  };

  // if user already logged in
  useEffect(() => {
    if (!user) return;

    // if (location.key === "default") navigate("/");
    // else {
    //   console.log(`🚀 ~ login`);

    //   navigate(-1);
    // }

    location.state?.previous
      ? navigate(location.state.previous)
      : navigate("/");
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
  }, [location.key, navigate]);

  useEffect(() => {
    error;
    console.log(`🚀 ~ useEffect ~ error:`, error);
  });

  return (
    <MyContainer.Center className="py-5">
      <Typography.Title>Đăng nhập</Typography.Title>
      <Form
        className="w-full max-w-sm"
        layout="vertical"
        onChange={() => setError(undefined)}
        disabled={submitting || isLogging}
        initialValues={{
          remember: true,
          // username: "12321",
        }}
        // size="large"
        onFinish={onFinish}
      >
        <Form.Item<TUserLoginPayload>
          label="Tên đăng nhập"
          name="username"
          rules={[
            {
              required: true,
              message: "Tên đăng nhập không bỏ trống",
            },
            // {
            //   min: 6,
            //   message: "Tên người dùng từ 6 kí tự trở lên",
            // },
            {
              pattern: /^[^\s]*$/,
              message: "Tên người dùng không chứa khoảng trắng",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item<TUserLoginPayload>
          label="Mật khẩu"
          name="password"
          rules={[
            {
              required: true,
              message: "Mật khẩu không bỏ trống",
            },
            // {
            //   min: 6,
            //   message: "Mật khẩu từ 6 kí tự trở lên",
            // },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Form.Item<TUserLoginPayload>
            name="remember"
            valuePropName="checked"
            noStyle
          >
            <Checkbox>Ghi nhớ</Checkbox>
          </Form.Item>
        </Form.Item>

        <Form.Item noStyle>
          <Space.Compact block>
            <MyButton
              block
              type="primary"
              loading={submitting || isLogging}
              danger={!!error}
              htmlType="submit"
            >
              Đăng nhập
            </MyButton>
            <MyButton block type="default" to="/register">
              Đăng ký
            </MyButton>
          </Space.Compact>
        </Form.Item>

        <Form.Item noStyle>
          {error && (
            <Alert
              type="error"
              message={error.error.map(({ msg }) => (
                <div key={msg} className="text-center">
                  <Typography.Text type="danger">{msg}</Typography.Text>
                </div>
              ))}
            />
          )}
        </Form.Item>
      </Form>
    </MyContainer.Center>
  );
}

export default Login;
