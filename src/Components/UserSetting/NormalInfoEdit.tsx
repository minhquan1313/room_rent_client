import MyButton from "@/Components/MyButton";
import PhoneOTP from "@/Components/PhoneOTP";
import SelectGender from "@/Components/SelectGender";
import SelectPhoneRegion from "@/Components/SelectPhoneRegion";
import { UserContext } from "@/Contexts/UserProvider";
import { TUserEditFields } from "@/Pages/UserInfo";
import { resendInterval } from "@/constants/resendInterval";
import { emailRule } from "@/rules/emailRule";
import { phoneRule } from "@/rules/phoneRule";
import { fetcher } from "@/services/fetcher";
import { sendEmailVerify } from "@/services/sendEmailVerify";
import { IUser } from "@/types/IUser";
import { dateFormat } from "@/utils/dateFormat";
import { isMobile } from "@/utils/isMobile";
import { notificationResponseError } from "@/utils/notificationResponseError";
import {
  CheckCircleFilled,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Form,
  Input,
  Space,
  Tooltip,
  Typography,
  message,
  notification,
  theme,
} from "antd";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import Countdown from "react-countdown";
import { useSearchParams } from "react-router-dom";

const NormalInfoEdit = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [notiApi, contextNotiHolder] = notification.useNotification();

  const [query, setQuery] = useSearchParams();

  const { user, refresh } = useContext(UserContext);

  useEffect(() => {
    /**
     * Sau khi số điện thoại đã được verify thì bỏ step đi
     */
    if (!user?.phone?.verified || !query.get("step")) return;

    query.delete("step");
    setQuery(query);
  }, [query, user?.phone?.verified]);

  if (!user) return null;
  return (
    <Form
      onFinish={async (e: TUserEditFields) => {
        const { first_name, last_name, phone, gender, email } = e;
        console.log(`🚀 ~ NormalInfoEdit ~ e:`, e);

        const payload: { [key: string]: any } = {};
        if (phone?.national_number !== user.phone?.national_number) {
          payload.tell = phone?.national_number;
          payload.region_code = phone?.region_code;
        }

        if (email?.email !== user.email?.email) {
          payload.email = email?.email;
        }
        if (gender?.title !== user.gender?.title) {
          payload.gender = gender?.title;
        }
        if (first_name !== user.first_name) {
          payload.first_name = first_name;
        }
        if (last_name !== user.last_name) {
          payload.last_name = last_name;
        }
        console.log(`🚀 ~ payload:`, payload);

        if (Object.keys(payload).length === 0) return;

        try {
          const d = await fetcher.patch(`/users/${user._id}`, payload);

          console.log(`🚀 ~ onFinish={ ~ d:`, d);

          messageApi.open({
            type: "success",
            content: "Cập nhật thông tin thành công!",
          });

          //   if ("email" in payload && user.email === null) {
          /**
           * Gửi luôn xác thực
           */
          // mailCodeSend(payload["email"]);
          //   }
          refresh();
        } catch (error: any) {
          console.log(`🚀 ~ error:`, error);

          // const e = error.response.data as ErrorJsonResponse;
          notificationResponseError({
            notification: notiApi,
            error,
            message: "Cập nhật thất bại!",
          });
        }
      }}
      initialValues={user}
      labelCol={{
        xs: { span: 24 },
        sm: { span: 6 },
      }}
      size={isMobile() ? "large" : undefined}
      className="w-full"
      // size="large"
    >
      {contextHolder}
      {contextNotiHolder}
      <Form.Item<TUserEditFields> name={"last_name"} label="Họ">
        <Input />
      </Form.Item>

      <Form.Item<TUserEditFields>
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
        name={"first_name"}
        label="Tên"
      >
        <Input />
      </Form.Item>

      <Form.Item<TUserEditFields> name={["gender", "title"]} label="Giới tính">
        <SelectGender />
      </Form.Item>

      <PhoneEdit user={user} refresh={refresh} />

      <EmailEdit user={user} email={user.email} />

      <Form.Item>
        <MyButton
          block
          type="primary"
          //   loading={submitting || isLogging}
          disabled={!!query.get("step")}
          //   danger={!!error}
          htmlType="submit"
        >
          Lưu
        </MyButton>
      </Form.Item>
    </Form>
  );
};

const PhoneEdit = ({ user, refresh }: { user: IUser; refresh(): void }) => {
  const [messageApi, contextHolder] = message.useMessage();

  const {
    token: { colorSuccess },
  } = theme.useToken();

  const [query, setQuery] = useSearchParams();
  const [sendingCode, setSendingCode] = useState(false);

  return (
    <Form.Item<TUserEditFields>
      label="Điện thoại"
      tooltip={
        user.phone?.verified && "Số điện thoại đã xác thực không thể thay đổi!"
      }
    >
      {contextHolder}
      <Space direction="vertical" className="w-full">
        <Form.Item<TUserEditFields>
          name={["phone", "national_number"]}
          rules={[
            {
              message: "Số điện thoại không được trống",
              required: true,
            },
            ...phoneRule,
          ]}
          noStyle
        >
          <Input
            readOnly={user.phone?.verified}
            addonBefore={
              <Form.Item<TUserEditFields>
                name={["phone", "region_code"]}
                noStyle
              >
                <SelectPhoneRegion disabled={user.phone?.verified} />
              </Form.Item>
            }
            addonAfter={
              <Tooltip
                title={user.phone?.verified ? "Đã xác thực" : "Chưa xác thực"}
              >
                {user.phone?.verified ? (
                  <CheckCircleFilled
                    style={{
                      color: colorSuccess,
                    }}
                  />
                ) : (
                  <ExclamationCircleOutlined />
                )}
              </Tooltip>
            }
          />
        </Form.Item>

        {user.phone &&
          !user.phone.verified &&
          (!query.get("step") ? (
            <>
              <Alert
                message="Số điện thoại chưa xác thực!"
                type="error"
                showIcon
              />
              <Space.Compact block>
                <MyButton
                  onClick={() => {
                    query.set("step", "enter-otp");
                    setQuery(query);
                  }}
                  block
                >
                  Nhập mã
                </MyButton>
                <MyButton
                  onClick={async () => {
                    setSendingCode(true);
                    try {
                      const payload = {
                        tel: user.phone?.e164_format,
                      };
                      const d = await fetcher.post(
                        `/misc/make-verify-tel`,
                        payload,
                      );
                      console.log(`🚀 ~ onClick={ ~ d:`, d);

                      messageApi.open({
                        type: "info",
                        content:
                          "Đã gửi mã, mã sẽ tới số điện thoại của bạn trong giây lát!",
                        duration: 30,
                      });

                      query.set("step", "enter-otp");
                      setQuery(query);
                    } catch (error) {
                      console.log(`🚀 ~ error:`, error);
                      messageApi.open({
                        type: "error",
                        content: "Có lỗi khi gửi mã!",
                        duration: 30,
                      });
                    }
                    setSendingCode(false);
                  }}
                  block
                  loading={sendingCode}
                  type="primary"
                >
                  Gửi mã
                </MyButton>
              </Space.Compact>
            </>
          ) : (
            query.get("step") === "enter-otp" && (
              // <>
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
            )
          ))}
      </Space>
    </Form.Item>
  );
};
const EmailEdit = ({ user, email }: { user: IUser; email: IUser["email"] }) => {
  const {
    token: { colorSuccess },
  } = theme.useToken();
  const [notiApi, contextNotiHolder] = notification.useNotification();

  const [mailCodeSent, setMailCodeSent] = useState(false);
  const [mailCodeSentAt, setMailCodeSentAt] = useState<Date>();
  const [mailCodeSending, setMailCodeSending] = useState(false);

  const oldMail = useRef(email);

  const countDownDate = useMemo(() => {
    const d = mailCodeSentAt ? new Date(mailCodeSentAt) : new Date();
    d.setSeconds(d.getSeconds() + resendInterval);
    return d;
  }, [mailCodeSent]);

  async function mailCodeSend(mail: string) {
    setMailCodeSending(true);
    try {
      await sendEmailVerify(mail);
      console.log(`mailCodeSend`);

      notiApi.open({
        type: "success",
        duration: 30,
        message: "Gửi mã thành công!",
        description: (
          <>
            Hãy kiểm tra{" "}
            <Typography.Text type="warning">hộp thư đến</Typography.Text> trong
            email, và cả hộp thư{" "}
            <Typography.Text type="warning">spam</Typography.Text>
          </>
        ),
      });

      setMailCodeSent(true);

      const d = new Date();
      setMailCodeSentAt(d);
      localStorage.setItem("emailTokenSentAt", String(d.getTime()));
    } catch (error) {
      console.log(`🚀 ~ error:`, error);

      notificationResponseError({
        error,
        message: "Lỗi gửi mã",
        notification: notiApi,
      });
      //
    }
    setMailCodeSending(false);
  }

  useEffect(() => {
    /**
     * Kiểm tra mail đã send hay chưa
     */
    try {
      const d = localStorage.getItem("emailTokenSentAt");
      if (!d) return;

      const date = dateFormat(Number(d));
      setMailCodeSentAt(date.toDate());

      const now = dateFormat();

      const diff = now.diff(date, "s");
      console.log(`🚀 ~ useEffect ~ diff:`, diff);

      if (diff > resendInterval) {
        setMailCodeSent(false);
      } else {
        setMailCodeSent(true);
      }
    } catch (error) {
      //
    }
  }, []);

  useEffect(() => {
    /**
     * Detect xem mail có phải mới được cập nhật không,
     * nếu mail hiện tại khác mail trước đó thì bắn luôn cái
     * token verify
     */

    console.log(`🚀 ~ useEffect ~ oldMail.current:`, oldMail.current);
    console.log(`🚀 ~ useEffect ~ email:`, email);
    if (oldMail.current?.email === email?.email) return;

    oldMail.current = email;

    if (!oldMail.current) return;

    mailCodeSend(oldMail.current.email);
  }, [email]);
  return (
    <Form.Item label="Email">
      {contextNotiHolder}
      <Space direction="vertical" className="w-full">
        <Form.Item<TUserEditFields>
          name={["email", "email"]}
          // noStyle
          rules={emailRule}
          noStyle
          validateTrigger="onBlur"
        >
          <Input
            addonAfter={
              user.email && (
                <Tooltip
                  title={user.email?.verified ? "Đã xác thực" : "Chưa xác thực"}
                >
                  {user.email?.verified ? (
                    <CheckCircleFilled
                      style={{
                        color: colorSuccess,
                      }}
                    />
                  ) : (
                    <ExclamationCircleOutlined />
                  )}
                </Tooltip>
              )
            }
          />
        </Form.Item>

        {!user.email ? (
          <Alert
            message={
              <>
                Hãy thêm email để có thể
                <Typography.Text type="warning" strong underline>
                  {" "}
                  khôi phục mật khẩu{" "}
                </Typography.Text>
                hoặc
                <Typography.Text type="warning"> nhận tin </Typography.Text>
                về các phòng mới/phòng yêu thích thay đổi!
              </>
            }
            type="error"
            showIcon
          />
        ) : (
          !user.email.verified && (
            <MyButton
              onClick={async () => {
                //
                if (!user.email) return;

                await mailCodeSend(user.email.email);
              }}
              loading={mailCodeSending}
              disabled={mailCodeSent}
              type="dashed"
              block
            >
              {mailCodeSent ? (
                <Space size={"small"}>
                  Gửi lại sau
                  {/*  */}
                  <Countdown
                    key={countDownDate.getMilliseconds()}
                    date={countDownDate}
                    onComplete={() => {
                      setMailCodeSent(false);
                      console.log(`🚀 ~ onComplete ~ setMailCodeSent(false):`);
                    }}
                    renderer={(props) =>
                      dateFormat
                        .duration(props.total, "milliseconds")
                        .asSeconds() || ""
                    }
                  />
                </Space>
              ) : (
                <>Gửi mã</>
              )}
            </MyButton>
          )
        )}
      </Space>
    </Form.Item>
  );
};

export default NormalInfoEdit;
