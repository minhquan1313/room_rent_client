import MyButton from "@/Components/MyButton";
import MyContainer from "@/Components/MyContainer";
import PhoneOTP from "@/Components/PhoneOTP";
import SelectGender from "@/Components/SelectGender";
import SelectPhoneRegion from "@/Components/SelectPhoneRegion";
import SelectRole from "@/Components/SelectRole";
import { GlobalDataContext } from "@/Contexts/GlobalDataProvider";
import { UserContext } from "@/Contexts/UserProvider";
import { noWhiteSpace } from "@/rules/noWhiteSpace";
import { passwordRule } from "@/rules/passwordRule";
import { phoneRule } from "@/rules/phoneRule";
import { sendOtp } from "@/services/sendOtp";
import { ErrorJsonResponse } from "@/types/ErrorJsonResponse";
import { UserRegisterPayload } from "@/types/IUser";
import { isMobile } from "@/utils/isMobile";
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
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

function Register() {
  pageTitle("Đăng ký");

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
    console.log(`🚀 ~ onFinish ~ values:`, values);

    setError(undefined);
    setSubmitting(true);

    try {
      await register(values, true);
    } catch (error: any) {
      console.log(`🚀 ~ error:`, error);

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

      await sendOtp(user.phone?.e164_format);
      otpSent.current = true;

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
  // console.log(`🚀 ~ file: Register.tsx:62 ~ useEffect ~ genders:`, genders);
  // role;
  // console.log(`🚀 ~ file: Register.tsx:67 ~ useEffect ~ role:`, role);
  // roles;
  // console.log(`🚀 ~ file: Register.tsx:79 ~ useEffect ~ roles:`, roles);
  // });

  return (
    <MyContainer.Center className="max-w-sm py-5">
      {contextHolder}
      <Typography.Title>Đăng ký</Typography.Title>
      {!query.get("step") ? (
        <Form
          name="register"
          className="w-full"
          layout="vertical"
          onChange={() => setError(undefined)}
          disabled={submitting || isLogging}
          initialValues={{
            region_code: "VN",
            first_name: "Binh",
            tell: 889379138,
            username: "binh",
            password: "1",
            role: "user",
            gender: "male",
          }}
          onFinish={onFinish}
          size={isMobile() ? "large" : undefined}
        >
          <Form.Item<UserRegisterPayload>
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

          <Form.Item<UserRegisterPayload>
            label="Mật khẩu"
            name="password"
            rules={[
              {
                required: true,
                message: "Mật khẩu không bỏ trống",
              },
              ...passwordRule,
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item<UserRegisterPayload>
                label="Họ và tên đệm"
                name="last_name"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<UserRegisterPayload>
                label="Tên"
                name="first_name"
                rules={[
                  {
                    required: true,
                    message: "Tên không bỏ trống",
                  },
                  noWhiteSpace,
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item<UserRegisterPayload>
            label="Số điện thoại"
            name="tell"
            rules={[
              {
                message: "Số điện thoại không được trống",
                required: true,
              },
              ...phoneRule,
            ]}
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
            label="Vai trò"
            name="role"
            rules={[
              {
                message: "Không được trống",
                required: true,
              },
            ]}
          >
            {!roles ? <Skeleton.Input active block /> : <SelectRole />}
          </Form.Item>

          <Form.Item<UserRegisterPayload>
            label="Giới tính"
            name="gender"
            rules={[
              {
                message: "Không được trống",
                required: true,
              },
            ]}
          >
            {!roles ? <Skeleton.Input active block /> : <SelectGender />}
          </Form.Item>

          <Form.Item noStyle={!error}>
            <Space.Compact block>
              <MyButton block loading={isLogging} type="default" to="/login">
                Đăng nhập
              </MyButton>

              <MyButton
                block
                type="primary"
                loading={submitting}
                disabled={!roles || !genders}
                danger={!!error}
                htmlType="submit"
              >
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
                  content: "Xác thực số điện thoại thành công!",
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
