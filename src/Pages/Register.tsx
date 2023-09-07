import MyButton from "@/Components/MyButton";
import MyContainer from "@/Components/MyContainer";
import { GlobalDataContext } from "@/Contexts/GlobalDataProvider";
import { UserContext } from "@/Contexts/UserContext";
import { ErrorJsonResponse } from "@/types/ErrorJsonResponse";
import { UserRegisterPayload } from "@/types/IUser";
import { isValidPhone } from "@/utils/isValidPhoneNumber";
import { pageTitle } from "@/utils/pageTitle";
import {
  Alert,
  Col,
  Form,
  Input,
  Row,
  Select,
  Skeleton,
  Space,
  Typography,
} from "antd";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const telCodes = [
  {
    region: "VN",
    code: "+84",
  },
];

function Register() {
  pageTitle("Đăng ký");

  const navigate = useNavigate();
  const location = useLocation();

  const { user, isLogging, register } = useContext(UserContext);
  const { roles, genders } = useContext(GlobalDataContext);
  const [error, setError] = useState<ErrorJsonResponse>();
  const [submitting, setSubmitting] = useState(false);

  const onFinish = (values: UserRegisterPayload) => {
    setError(undefined);
    setSubmitting(true);

    (async () => {
      try {
        const d = await register(values, true);
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
    // genders;
    // console.log(`🚀 ~ file: Register.tsx:62 ~ useEffect ~ genders:`, genders);
    // role;
    // console.log(`🚀 ~ file: Register.tsx:67 ~ useEffect ~ role:`, role);
    // roles;
    // console.log(`🚀 ~ file: Register.tsx:79 ~ useEffect ~ roles:`, roles);
  });

  return (
    <MyContainer.Center className="py-5">
      <Typography.Title>Đăng ký</Typography.Title>

      <Form
        name="register"
        className="w-full max-w-sm"
        layout="vertical"
        onChange={() => setError(undefined)}
        disabled={submitting || isLogging}
        initialValues={{
          region_code: telCodes[0].region,
          first_name: "Binh",
          tell: 889379138,
          username: "binh",
          password: "1",
        }}
        onFinish={onFinish}
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
            // {
            //   min: 6,
            //   message: "Mật khẩu từ 6 kí tự trở lên",
            // },
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
                {
                  pattern: /^[^\s]*$/,
                  message: "Tên không chứa khoảng trắng",
                },
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
            ({ getFieldValue }) => ({
              message: "Số điện thoại không hợp lệ",
              validator(rule, value, callback) {
                const rc = getFieldValue("region_code");

                if (value && rc && isValidPhone(value, rc))
                  return Promise.resolve();

                return Promise.reject();
              },
            }),
          ]}
        >
          <Input
            addonBefore={
              <Form.Item<UserRegisterPayload> name="region_code" noStyle>
                <Select>
                  {telCodes.map(({ code, region }) => (
                    <Select.Option key={region} value={region}>
                      {code}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            }
          />
        </Form.Item>

        <Form.Item noStyle={!!roles}>
          {!roles ? (
            <Skeleton.Input active block />
          ) : (
            <Form.Item<UserRegisterPayload>
              label="Vai trò"
              name="role"
              // required={false}
              initialValue={roles.find(({ title }) => title === "user")?.title}
              rules={[
                {
                  message: "Không được trống",
                  required: true,
                },
              ]}
            >
              <Select>
                {roles.map(({ display_name, title }) => (
                  <Select.Option key={title} value={title}>
                    {display_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}
        </Form.Item>
        <Form.Item noStyle={!!genders}>
          {!genders ? (
            <Skeleton.Input active block />
          ) : (
            <Form.Item<UserRegisterPayload>
              label="Giới tính"
              name="gender"
              // required={false}
              initialValue={
                genders.find(({ title }) => title === "male")?.title
              }
              rules={[
                {
                  message: "Không được trống",
                  required: true,
                },
              ]}
            >
              <Select>
                {genders.map(({ display_name, title }) => (
                  <Select.Option key={title} value={title}>
                    {display_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}
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
    </MyContainer.Center>
  );
}

export default Register;
