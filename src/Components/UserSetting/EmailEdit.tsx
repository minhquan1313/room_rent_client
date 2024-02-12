import MyButton from "@/Components/MyButton";
import { TUserEditFields } from "@/Pages/UserInfo";
import { resendInterval } from "@/constants/resendInterval";
import { emailRule } from "@/rules/emailRule";
import { sendEmailVerify } from "@/services/sendEmailVerify";
import { IUser } from "@/types/IUser";
import { dateFormat } from "@/utils/dateFormat";
import logger from "@/utils/logger";
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
  notification,
  theme,
} from "antd";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import Countdown from "react-countdown";
import { useTranslation } from "react-i18next";

type Props = {
  user: IUser;
  email: IUser["email"];
};

const EmailEdit = memo(({ user, email }: Props) => {
  const { t } = useTranslation();

  const {
    token: { colorSuccess },
  } = theme.useToken();
  const [notify, contextNotify] = notification.useNotification();

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
      logger(`mailCodeSend`);

      notify.open({
        type: "success",
        duration: 30,
        message: t("Extra.Code send succeed!"),
        description: (
          <>
            {t("User.Email tab.Please check email and in spam folder#1")}{" "}
            <Typography.Text type="warning">
              {t("User.Email tab.Please check email and in spam folder#2")}
            </Typography.Text>{" "}
            {t("User.Email tab.Please check email and in spam folder#3")}{" "}
            <Typography.Text type="warning">
              {t("User.Email tab.Please check email and in spam folder#4")}
            </Typography.Text>
          </>
        ),
      });

      setMailCodeSent(true);

      const d = new Date();
      setMailCodeSentAt(d);
      localStorage.setItem("emailTokenSentAt", String(d.getTime()));
    } catch (error) {
      logger(`🚀 ~ error:`, error);

      notificationResponseError({
        error,
        message: t("Extra.Code send failed!"),
        notification: notify,
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
      logger(`🚀 ~ useEffect ~ diff:`, diff);

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

    logger(`🚀 ~ useEffect ~ oldMail.current:`, oldMail.current);
    logger(`🚀 ~ useEffect ~ email:`, email);
    if (oldMail.current?.email === email?.email) return;

    oldMail.current = email;

    if (!oldMail.current) return;

    mailCodeSend(oldMail.current.email);
  }, [email]);
  return (
    <Form.Item label="Email">
      {contextNotify}
      <Space direction="vertical" className="w-full">
        <Form.Item<TUserEditFields>
          name={["email", "email"]}
          // noStyle
          rules={[emailRule]}
          noStyle
          validateTrigger="onBlur"
        >
          <Input
            addonAfter={
              user.email && (
                <Tooltip
                  title={
                    user.email?.verified
                      ? t("Room detail.Verified")
                      : t("Room detail.Not verified")
                  }
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
                {t("User.Email tab.Please add email to do what#1")}
                <Typography.Text type="warning" strong underline>
                  {" "}
                  {t("User.Email tab.Please add email to do what#2")}{" "}
                </Typography.Text>
                {t("User.Email tab.Please add email to do what#3")}
                <Typography.Text type="warning">
                  {" "}
                  {t("User.Email tab.Please add email to do what#4")}{" "}
                </Typography.Text>
                {t("User.Email tab.Please add email to do what#5")}
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
                  {t("User.Email tab.Re-send after")}
                  <Countdown
                    key={countDownDate.getMilliseconds()}
                    date={countDownDate}
                    onComplete={() => {
                      setMailCodeSent(false);
                      logger(`🚀 ~ onComplete ~ setMailCodeSent(false):`);
                    }}
                    renderer={(props) =>
                      dateFormat
                        .duration(props.total, "milliseconds")
                        .asSeconds() || ""
                    }
                  />
                </Space>
              ) : (
                t("Extra.Send code")
              )}
            </MyButton>
          )
        )}
      </Space>
    </Form.Item>
  );
});

export default EmailEdit;
