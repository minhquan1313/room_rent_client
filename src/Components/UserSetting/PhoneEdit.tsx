import MyButton from "@/Components/MyButton";
import PhoneOTP from "@/Components/PhoneOTP";
import SelectPhoneRegion from "@/Components/SelectPhoneRegion";
import { TUserEditFields } from "@/Pages/UserInfo";
import { phoneRules } from "@/rules/phoneRule";
import { fetcher } from "@/services/fetcher";
import { IUser } from "@/types/IUser";
import logger from "@/utils/logger";
import {
  CheckCircleFilled,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Alert, Form, Input, Space, Tooltip, message, theme } from "antd";
import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

type Props = {
  user: IUser;
  refresh(): void;
};

const PhoneEdit = memo(({ user, refresh }: Props) => {
  const { t } = useTranslation();

  const [messageApi, contextHolder] = message.useMessage();

  const {
    token: { colorSuccess },
  } = theme.useToken();

  const [query, setQuery] = useSearchParams();
  const [sendingCode, setSendingCode] = useState(false);

  return (
    <Form.Item<TUserEditFields>
      label={t("User.Phone number")}
      tooltip={
        user.phone?.verified && "Số điện thoại đã xác thực không thể thay đổi!"
      }
    >
      {contextHolder}
      <Space direction="vertical" className="w-full">
        <Form.Item<TUserEditFields>
          name={["phone", "national_number"]}
          rules={phoneRules}
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
                title={
                  user.phone?.verified
                    ? t("Room detail.Verified")
                    : t("Room detail.Not verified")
                }
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
                message={t("User.Phone tab.Tel number haven't verified yet!")}
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
                  {t("Extra.Enter code")}
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
                      logger(`🚀 ~ onClick={ ~ d:`, d);

                      messageApi.open({
                        type: "info",
                        content: t(
                          "Extra.OTP sent, the code will be delivered to your phone in sometime!",
                        ),
                        duration: 30,
                      });

                      query.set("step", "enter-otp");
                      setQuery(query);
                    } catch (error) {
                      logger(`🚀 ~ error:`, error);
                      messageApi.open({
                        type: "error",
                        content: t("Extra.OTP send error, please try again!"),
                        duration: 30,
                      });
                    }
                    setSendingCode(false);
                  }}
                  block
                  loading={sendingCode}
                  type="primary"
                >
                  {t("Extra.Send code")}
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
                    content: t("Extra.Verify successfully!"),
                  });
                }}
              />
            )
          ))}
      </Space>
    </Form.Item>
  );
});

export default PhoneEdit;
