import MyButton from "@/Components/MyButton";
import SelectGender from "@/Components/SelectGender";
import EmailEdit from "@/Components/UserSetting/EmailEdit";
import PhoneEdit from "@/Components/UserSetting/PhoneEdit";
import { UserContext } from "@/Contexts/UserProvider";
import { TUserEditFields } from "@/Pages/UserInfo";
import { noEmptyRule } from "@/rules/noEmptyRule";
import { noWhiteSpaceRule } from "@/rules/noWhiteSpace";
import { fetcher } from "@/services/fetcher";
import { isMobile } from "@/utils/isMobile";
import logger from "@/utils/logger";
import { notificationResponseError } from "@/utils/notificationResponseError";
import { Form, Input, message, notification } from "antd";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

const NormalInfoEdit = () => {
  const { t } = useTranslation();

  const [messageApi, contextHolder] = message.useMessage();
  const [notifyApi, contextNotifyHolder] = notification.useNotification();

  const [query, setQuery] = useSearchParams();

  const { user, refresh } = useContext(UserContext);

  useEffect(() => {
    /**
     * Sau khi số điện thoại đã được verify thì bỏ step đi
     */
    if (!user?.phone?.verified || !query.get("step")) return;

    query.delete("step");
    setQuery(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, user?.phone?.verified]);

  if (!user) return null;
  return (
    <Form
      onFinish={async (e: TUserEditFields) => {
        const { first_name, last_name, phone, gender, email } = e;
        logger(`🚀 ~ NormalInfoEdit ~ e:`, e);

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
        logger(`🚀 ~ payload:`, payload);

        if (Object.keys(payload).length === 0) return;

        try {
          const d = await fetcher.patch(`/users/${user._id}`, payload);

          logger(`🚀 ~ onFinish={ ~ d:`, d);

          messageApi.open({
            type: "success",
            content: t("Extra.Update successfully!"),
          });

          //   if ("email" in payload && user.email === null) {
          /**
           * Gửi luôn xác thực
           */
          // mailCodeSend(payload["email"]);
          //   }
          refresh();
        } catch (error: any) {
          logger(`🚀 ~ error:`, error);

          notificationResponseError({
            notification: notifyApi,
            error,
            message: t("Extra.Update failure!"),
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
    >
      {contextHolder}
      {contextNotifyHolder}
      <Form.Item<TUserEditFields>
        name={"last_name"}
        label={t("User.Last name")}
      >
        <Input />
      </Form.Item>

      <Form.Item<TUserEditFields>
        rules={[noEmptyRule, noWhiteSpaceRule]}
        name={"first_name"}
        label={t("User.First name")}
      >
        <Input />
      </Form.Item>

      <Form.Item<TUserEditFields>
        name={["gender", "title"]}
        label={t("User.Gender")}
      >
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
          {t("Extra.Save")}
        </MyButton>
      </Form.Item>
    </Form>
  );
};

export default NormalInfoEdit;
