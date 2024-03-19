import { NotificationContext } from "@/Contexts/NotificationProvider";
import { UserContext } from "@/Contexts/UserProvider";
import logger from "@/utils/logger";
import {
  Alert,
  Form,
  Space,
  Switch,
  SwitchProps,
  Typography,
  message,
} from "antd";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";

const NotifyEdit = () => {
  const { t } = useTranslation();

  const [messageApi, contextHolder] = message.useMessage();

  const { user } = useContext(UserContext);
  const { denied, enabling, register, unRegister } =
    useContext(NotificationContext);

  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();
  logger(`🚀 ~ loading:`, loading);

  const onSwitchChangeHandle: SwitchProps["onChange"] = async (e) => {
    logger(`🚀 ~ onFinish={ ~ e:`, e);
    setLoading(true);
    if (e) {
      if (await register()) {
        messageApi.open({
          type: "success",
          content: t(
            "User.Notification tab.Turning notify message successfully!",
          ),
        });
      } else {
        messageApi.open({
          type: "error",
          content: t("User.Notification tab.Turning notify message failure!"),
        });
      }
    } else {
      await unRegister();
    }
    setLoading(false);
  };

  if (!user) return null;

  return (
    <Form className="w-full" form={form}>
      {contextHolder}
      <Form.Item>
        <Space direction="vertical" className="w-full">
          <Space>
            <Switch
              disabled={denied}
              checked={enabling}
              loading={loading}
              onChange={onSwitchChangeHandle}
            />

            <Typography.Text disabled={denied}>
              {t("User.Notification tab.Notify new message")}
            </Typography.Text>
          </Space>

          {denied && (
            <Alert
              type="warning"
              message={t("User.Notification tab.User denied")}
              showIcon
            />
          )}
        </Space>
      </Form.Item>

      {/* <Form.Item>
        <Space>
          <Switch
            disabled={true}
            onChange={async (e) => {
              logger(`🚀 ~ onFinish={ ~ e:`, e);
            }}
          />

          <Typography.Text disabled={true}>
            Thông báo khi phòng đã lưu thay đổi
          </Typography.Text>
        </Space>
      </Form.Item> */}

      {/* <Form.Item>
        <Space>
          <Switch
            disabled={denied}
            checked={enabling}
            loading={loading}
            onChange={async (e) => {
              logger(`🚀 ~ onFinish={ ~ e:`, e);
              // setLoading(true);
              // if (e) {
              //   if (await register()) {
              //     messageApi.open({
              //       type: "success",
              //       content: "Bật thông báo thành công!",
              //     });
              //   } else {
              //     messageApi.open({
              //       type: "error",
              //       content: "Bật thông báo thất bại!",
              //     });
              //   }
              // } else {
              //   await unRegister();
              // }
              // setLoading(false);
            }}
          />
          <Typography.Text disabled={denied}>
            Thông báo nhận tin phòng mới
          </Typography.Text>
        </Space>
      </Form.Item> */}
    </Form>
  );
};

export default NotifyEdit;
