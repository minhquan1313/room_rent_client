import LanguageSwitcher from "@/Components/Header/LanguageSwitcher";
import MyButton from "@/Components/MyButton";
import MyContainer from "@/Components/MyContainer";
import PhoneOTP from "@/Components/PhoneOTP";
import SelectGender from "@/Components/SelectGender";
import SelectPhoneRegion from "@/Components/SelectPhoneRegion";
import SelectRole from "@/Components/SelectRole";
import ServerErrorResponse from "@/Components/ServerResponse/ServerErrorResponse";
import { GlobalDataContext } from "@/Contexts/GlobalDataProvider";
import { UserContext } from "@/Contexts/UserProvider";
import { noEmptyRule } from "@/rules/noEmptyRule";
import { noWhiteSpaceRule } from "@/rules/noWhiteSpace";
import { passwordRules } from "@/rules/passwordRules";
import { phoneRules } from "@/rules/phoneRules";
import { usernameRules } from "@/rules/usernameRules";
import { sendOtp } from "@/services/sendOtp";
import { UserRegisterPayload } from "@/types/IUser";
import { isMobile } from "@/utils/isMobile";
import logger from "@/utils/logger";
import { pageTitle } from "@/utils/pageTitle";
import { Col, Form, Input, Row, Skeleton, Space, Typography, message } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

type TField = UserRegisterPayload;

function Register() {
  const { t } = useTranslation();

  pageTitle(t("page name.Register"));

  const [messageApi, contextHolder] = message.useMessage();

  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useSearchParams();

  const { user, isLogging, register, refresh } = useContext(UserContext);
  const { roles, genders } = useContext(GlobalDataContext);

  const [error, setError] = useState<unknown>();
  const [submitting, setSubmitting] = useState(false);

  const otpSent = useRef(false);

  const onFinishHandle = async (values: TField) => {
    logger(`🚀 ~ onFinish ~ values:`, values);

    setError(undefined);
    setSubmitting(true);

    try {
      await register(values, true);
    } catch (error) {
      logger(`🚀 ~ file: Register.tsx:63 ~ onFinish ~ error:`, error);

      setError((error as any)?.response?.data);
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

    location.state?.previous ? navigate(location.state.previous) : navigate("/");
  });
  useEffect(() => {
    /**
     * Đã đăng nhập nhưng số điện thoại chưa xác nhận thì qua bước xác nhận
     */
    (async () => {
      if (!user || otpSent.current || !user.phone) return;
      if (user.phone.verified) return;

      setSubmitting(true);
      setError(undefined);
      try {
        otpSent.current = true;
        await sendOtp(user.phone?.e164_format);
        query.set("step", "enter-otp");
        setQuery(query);
      } catch (error) {
        setError((error as any)?.response?.data);
      }

      setSubmitting(false);
    })();
  }, [user]);

  // when user press go back but not login
  useEffect(() => {
    const popstateHandle = (e: PopStateEvent): void => {
      e.preventDefault();

      if (location.key === "default") navigate("/");
      else navigate(-2);
    };

    window.addEventListener("popstate", popstateHandle);

    return () => {
      window.removeEventListener("popstate", popstateHandle);
    };
  }, [location.key, navigate]);

  return (
    <MyContainer.Center className="max-w-sm py-5">
      {contextHolder}
      <Typography.Title>{t("Register page.Sign up")}</Typography.Title>
      <LanguageSwitcher />

      {!query.get("step") ? (
        <Form
          name="register"
          className="w-full"
          layout="vertical"
          onChange={() => setError(undefined)}
          disabled={submitting || isLogging}
          initialValues={{
            region_code: "VN",
            //   first_name: "Binh",
            //   tell: 889379138,
            //   username: "binh",
            //   password: "1",
            //   role: "user",
            //   gender: "male",
          }}
          onFinish={onFinishHandle}
          size={isMobile() ? "large" : undefined}
        >
          <Form.Item<TField> label={t("Register page.Username")} name="username" rules={usernameRules()}>
            <Input />
          </Form.Item>

          <Form.Item<TField> label={t("User.Password")} name="password" rules={passwordRules()}>
            <Input.Password />
          </Form.Item>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item<TField> label={t("User.Last name")} name="last_name">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<TField> label={t("User.First name")} name="first_name" rules={[noEmptyRule(), noWhiteSpaceRule()]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item<TField> label={t("User.Phone number")} name="tell" rules={phoneRules()}>
            <Input
              addonBefore={
                <Form.Item<TField> name="region_code" noStyle>
                  <SelectPhoneRegion />
                </Form.Item>
              }
            />
          </Form.Item>

          <Form.Item<TField> label={t("User.Role")} name="role" rules={[noEmptyRule()]}>
            {!roles ? <Skeleton.Input active block /> : <SelectRole />}
          </Form.Item>

          <Form.Item<TField> label={t("User.Gender")} name="gender" rules={[noEmptyRule()]}>
            {!roles ? <Skeleton.Input active block /> : <SelectGender />}
          </Form.Item>

          <Form.Item noStyle={!error}>
            <Space.Compact block>
              <MyButton block loading={isLogging} type="default" to="/login">
                {t("Register page.Sign in")}
              </MyButton>

              <MyButton block type="primary" loading={submitting} disabled={!roles || !genders} danger={!!error} htmlType="submit">
                {t("Register page.Sign up")}
              </MyButton>
            </Space.Compact>
          </Form.Item>

          <Form.Item noStyle>
            <ServerErrorResponse errors={error} />
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
