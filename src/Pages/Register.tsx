import MyButton from "@/Components/MyButton";
import MyContainer from "@/Components/MyContainer";
import PhoneOTP from "@/Components/PhoneOTP";
import SelectGender from "@/Components/SelectGender";
import SelectPhoneRegion from "@/Components/SelectPhoneRegion";
import SelectRole from "@/Components/SelectRole";
import { GlobalDataContext } from "@/Contexts/GlobalDataProvider";
import { UserContext } from "@/Contexts/UserProvider";
import { noEmptyRule } from "@/rules/noEmptyRule";
import { noWhiteSpaceRule } from "@/rules/noWhiteSpace";
import { passwordRules } from "@/rules/passwordRules";
import { phoneRules } from "@/rules/phoneRules";
import { usernameRules } from "@/rules/usernameRules";
import { sendOtp } from "@/services/sendOtp";
import { ErrorJsonResponse } from "@/types/ErrorJsonResponse";
import { UserRegisterPayload } from "@/types/IUser";
import { isMobile } from "@/utils/isMobile";
import logger from "@/utils/logger";
import { pageTitle } from "@/utils/pageTitle";
import {
  Alert,
  Col,
  Form,
  Input,
  Row,
  Skeleton,
  Space,
  Typography,
  message,
} from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

function Register() {
  const { t } = useTranslation();

  pageTitle(t("page name.Register"));

  const [messageApi, contextHolder] = message.useMessage();

  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useSearchParams();

  const { user, isLogging, register, refresh } = useContext(UserContext);
  const { roles, genders } = useContext(GlobalDataContext);

  const [error, setError] = useState<ErrorJsonResponse>();
  const [submitting, setSubmitting] = useState(false);

  const otpSent = useRef(false);

  const onFinish = async (values: UserRegisterPayload) => {
    logger(`🚀 ~ onFinish ~ values:`, values);

    setError(undefined);
    setSubmitting(true);

    try {
      await register(values, true);
    } catch (error: any) {
      logger(`🚀 ~ error:`, error);

      setError(error.response.data as ErrorJsonResponse);
    }
    setSubmitting(false);
  };

  // const genderSelectJsx = useMemo(
  //   () => (
  //     <Select>
  //       {genders &&
  //         genders.map(({ display_name, title }) => (
  //           <Select.Option key={title} value={title}>
  //             {display_name}
  //           </Select.Option>
  //         ))}
  //     </Select>
  //   ),
  //   [genders],
  // );

  // if user already logged in
  useEffect(() => {
    /**
     * Khi chưa đăng nhập, hoặc đã đăng nhập nhưng số điện thoại chưa xác nhận
     */
    if (!user || !user.phone?.verified) return;

    location.state?.previous
      ? navigate(location.state.previous)
      : navigate("/");
  });
  useEffect(() => {
    /**
     * Đã đăng nhập nhưng số điện thoại chưa xác nhận thì qua bước xác nhận
     */
    (async () => {
      if (!user || otpSent.current || !user.phone) return;
      if (user.phone.verified) return;

      setSubmitting(true);
      await sendOtp(user.phone?.e164_format);
      otpSent.current = true;
      setSubmitting(false);

      query.set("step", "enter-otp");
      setQuery(query);
    })();
  }, [user]);

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
  // genders;
  // logger(`🚀 ~ file: Register.tsx:62 ~ useEffect ~ genders:`, genders);
  // role;
  // logger(`🚀 ~ file: Register.tsx:67 ~ useEffect ~ role:`, role);
  // roles;
  // logger(`🚀 ~ file: Register.tsx:79 ~ useEffect ~ roles:`, roles);
  // });

  return (
    <MyContainer.Center className="max-w-sm py-5">
      {contextHolder}
      <Typography.Title>{t("Register page.Sign up")}</Typography.Title>

      {!query.get("step") ? (
        <Form
          name="register"
          className="w-full"
          layout="vertical"
          onChange={() => setError(undefined)}
          disabled={submitting || isLogging}
          // initialValues={{
          //   region_code: "VN",
          //   first_name: "Binh",
          //   tell: 889379138,
          //   username: "binh",
          //   password: "1",
          //   role: "user",
          //   gender: "male",
          // }}
          onFinish={onFinish}
          size={isMobile() ? "large" : undefined}
        >
          <Form.Item<UserRegisterPayload>
            label={t("Register page.Username")}
            name="username"
            rules={usernameRules}
          >
            <Input />
          </Form.Item>

          <Form.Item<UserRegisterPayload>
            label={t("User.Password")}
            name="password"
            rules={passwordRules}
          >
            <Input.Password />
          </Form.Item>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item<UserRegisterPayload>
                label={t("User.Last name")}
                name="last_name"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<UserRegisterPayload>
                label={t("User.First name")}
                name="first_name"
                rules={[noEmptyRule, noWhiteSpaceRule]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item<UserRegisterPayload>
            label={t("User.Phone number")}
            name="tell"
            rules={phoneRules}
          >
            <Input
              addonBefore={
                <Form.Item<UserRegisterPayload> name="region_code" noStyle>
                  <SelectPhoneRegion />
                </Form.Item>
              }
            />
          </Form.Item>

          <Form.Item<UserRegisterPayload>
            label={t("User.Role")}
            name="role"
            rules={[noEmptyRule]}
          >
            {!roles ? <Skeleton.Input active block /> : <SelectRole />}
          </Form.Item>

          <Form.Item<UserRegisterPayload>
            label={t("User.Gender")}
            name="gender"
            rules={[noEmptyRule]}
          >
            {!roles ? <Skeleton.Input active block /> : <SelectGender />}
          </Form.Item>

          <Form.Item noStyle={!error}>
            <Space.Compact block>
              <MyButton block loading={isLogging} type="default" to="/login">
                {t("Register page.Sign in")}
              </MyButton>

              <MyButton
                block
                type="primary"
                loading={submitting}
                disabled={!roles || !genders}
                danger={!!error}
                htmlType="submit"
              >
                {t("Register page.Sign up")}
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
      ) : (
        query.get("step") === "enter-otp" &&
        user?.phone && (
          <>
            <PhoneOTP
              e164_format={user.phone.e164_format}
              onSuccess={() => {
                refresh();
                messageApi.open({
                  type: "success",
                  content: t("User.Phone tab.Tel verify successfully!"),
                });
              }}
            />
          </>
        )
      )}
    </MyContainer.Center>
  );
}

export default Register;
