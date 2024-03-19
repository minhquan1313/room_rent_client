import MyButton from "@/Components/MyButton";
import ServerErrorResponse from "@/Components/ServerResponse/ServerErrorResponse";
import { UserContext } from "@/Contexts/UserProvider";
import { TUserEditFields } from "@/Pages/UserInfo";
import { passwordRules } from "@/rules/passwordRules";
import { fetcher } from "@/services/fetcher";
import logger from "@/utils/logger";
import { Form, Input, message } from "antd";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";

import { memo } from "react";

export interface PasswordEditProps {
  //
}

const PasswordEdit = memo(function PasswordEdit(props: PasswordEditProps) {
  const { t } = useTranslation();

  const [notifyApi, contextHolder] = message.useMessage();

  const { user, refresh } = useContext(UserContext);

  const [form] = Form.useForm();

  const [error, setError] = useState<unknown>();

  const onFinishHandle = async (e: TUserEditFields) => {
    if (!user) return null;
    setError(undefined);
    try {
      const d = await fetcher.patch(`/users/${user._id}`, e);
      logger(`🚀 ~ PasswordEdit ~ d:`, d);

      logger(`🚀 ~ NormalInfoEdit ~ e:`, e);
      notifyApi.open({
        type: "success",
        content: t("Extra.Update successfully!"),
      });
      refresh();
      form.resetFields();
    } catch (error: any) {
      logger(`🚀 ~ error:`, error);

      setError((error as any)?.response?.data);

      // notificationResponseError({
      //   error,
      //   message: t("Extra.Update failure!"),
      //   notification: notifyApi,
      // });
    }
  };

  if (!user) return null;

  return (
    <Form
      onFinish={onFinishHandle}
      labelCol={{
        xs: { span: 24 },
        sm: { span: 8 },
      }}
      className="w-full"
      form={form}
    >
      {contextHolder}
      <ServerErrorResponse errors={error} mode="notification" />

      <Form.Item<TUserEditFields>
        rules={passwordRules()}
        name={"old_password"}
        label={t("User.Pass tab.Current")}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item<TUserEditFields>
        rules={passwordRules()}
        name={"password"}
        label={t("User.Pass tab.New")}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item<TUserEditFields>
        rules={[
          ({ getFieldValue }) => ({
            message: t("User.Pass tab.Repeat not match!"),
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject();
            },
          }),
        ]}
        validateTrigger={"onBlur"}
        name={"passwordConfirm"}
        label={t("User.Pass tab.Repeat")}
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
          {t("Extra.Save")}
        </MyButton>
      </Form.Item>
    </Form>
  );
});

export default PasswordEdit;
