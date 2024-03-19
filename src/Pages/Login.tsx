import LanguageSwitcher from "@/Components/Header/LanguageSwitcher";
import MyButton from "@/Components/MyButton";
import MyContainer from "@/Components/MyContainer";
import ServerErrorResponse from "@/Components/ServerResponse/ServerErrorResponse";
import { UserContext } from "@/Contexts/UserProvider";
import { passwordRules } from "@/rules/passwordRules";
import { usernameRules } from "@/rules/usernameRules";
import { UserLoginPayload } from "@/types/IUser";
import { isMobile } from "@/utils/isMobile";
import logger from "@/utils/logger";
import { pageTitle } from "@/utils/pageTitle";
import { Checkbox, Form, Input, Space, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

type TField = UserLoginPayload & {
  remember: boolean;
};

function Login() {
  const { t } = useTranslation();

  pageTitle(t("page name.Login"));

  const navigate = useNavigate();
  const location = useLocation();

  const { user, isLogging, login } = useContext(UserContext);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<unknown>();

  const onFinish = async (values: TField) => {
    setError(undefined);
    setSubmitting(true);

    try {
      const { remember } = values;

      await login(values, remember);
    } catch (error) {
      logger(`🚀 ~ file: Login.tsx:43 ~ error:`, error);

      setError((error as any)?.response?.data);
    }

    setSubmitting(false);
  };

  // if user already logged in
  useEffect(() => {
    if (!user) return;

    // if (location.key === "default") navigate("/");
    // else {
    //   logger(`🚀 ~ login`);

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

  // useEffect(() => {
  //   error;
  //   logger(`🚀 ~ useEffect ~ error:`, error);
  // });

  return (
    <MyContainer.Center className="max-w-sm py-5">
      <Typography.Title>{t("Register page.Sign in")}</Typography.Title>
      <LanguageSwitcher />
      <Form
        className="w-full"
        layout="vertical"
        onChange={() => setError(undefined)}
        disabled={submitting || isLogging}
        initialValues={{
          remember: true,
          // username: "12321",
        }}
        onFinish={onFinish}
        size={isMobile() ? "large" : undefined}
      >
        <Form.Item<TField>
          label={t("Register page.Username")}
          name="username"
          rules={usernameRules()}
        >
          <Input />
        </Form.Item>

        <Form.Item<TField>
          label={t("User.Password")}
          name="password"
          rules={passwordRules()}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Form.Item<TField> name="remember" valuePropName="checked" noStyle>
            <Checkbox>{t("Register page.Remember")}</Checkbox>
          </Form.Item>
        </Form.Item>

        <Form.Item noStyle={!error}>
          <Space.Compact block>
            <MyButton
              block
              type="primary"
              loading={submitting || isLogging}
              danger={!!error}
              htmlType="submit"
            >
              {t("Register page.Sign in")}
            </MyButton>
            <MyButton block type="default" to="/register">
              {t("Register page.Sign up")}
            </MyButton>
          </Space.Compact>
        </Form.Item>

        <Form.Item noStyle>
          <ServerErrorResponse errors={error} />
        </Form.Item>
      </Form>
    </MyContainer.Center>
  );
}

export default Login;
