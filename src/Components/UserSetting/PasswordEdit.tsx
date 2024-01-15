import MyButton from "@/Components/MyButton";
import { UserContext } from "@/Contexts/UserProvider";
import { TUserEditFields } from "@/Pages/UserInfo";
import { passwordRule } from "@/rules/passwordRule";
import { fetcher } from "@/services/fetcher";
import logger from "@/utils/logger";
import { notificationResponseError } from "@/utils/notificationResponseError";
import { Form, Input, message, notification } from "antd";
import { useContext } from "react";

const PasswordEdit = () => {
  const [notifyApi, contextHolder] = notification.useNotification();
  const [messageApi, contextHolderMessage] = message.useMessage();

  const { user, refresh } = useContext(UserContext);

  const [form] = Form.useForm();

  if (!user) return null;

  return (
    <Form
      onFinish={async (e: TUserEditFields) => {
        try {
          const d = await fetcher.patch(`/users/${user._id}`, e);
          logger(`🚀 ~ PasswordEdit ~ d:`, d);

          logger(`🚀 ~ NormalInfoEdit ~ e:`, e);
          messageApi.open({
            type: "success",
            content: "Cập nhật mật khẩu thành công!",
          });
          refresh();
          form.resetFields();
        } catch (error: any) {
          logger(`🚀 ~ error:`, error);
          notificationResponseError({
            error,
            message: "Cập nhật thất bại!",
            notification: notifyApi,
          });
        }
      }}
      labelCol={{
        xs: { span: 24 },
        sm: { span: 8 },
      }}
      className="w-full"
      form={form}
    >
      {contextHolder}
      {contextHolderMessage}
      <Form.Item<TUserEditFields>
        rules={[
          {
            required: true,
            message: "Hãy nhập mật khẩu cũ!",
          },
          ...passwordRule,
        ]}
        name={"old_password"}
        label="Mật khẩu cũ"
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item<TUserEditFields>
        rules={[
          {
            required: true,
            message: "Hãy nhập mật khẩu mới!",
          },
          ...passwordRule,
        ]}
        name={"password"}
        label="Mật khẩu mới"
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item<TUserEditFields>
        rules={[
          {
            required: true,
            message: "Hãy xác nhận lại mật khẩu!",
          },
          ({ getFieldValue }) => ({
            message: "Mật khẩu không khớp!",
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject();
            },
          }),
          ...passwordRule,
        ]}
        validateTrigger={"onBlur"}
        name={"passwordConfirm"}
        label="Xác nhận"
        dependencies={["password"]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <MyButton
          block
          type="primary"
          //   loading={submitting || isLogging}
          //   disabled={!roomServicesConverted || !roomTypes}
          //   danger={!!error}
          htmlType="submit"
        >
          Lưu
        </MyButton>
      </Form.Item>
    </Form>
  );
};

export default PasswordEdit;
