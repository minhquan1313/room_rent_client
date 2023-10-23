import MyButton from "@/Components/MyButton";
import SelectGender from "@/Components/SelectGender";
import SelectPhoneRegion from "@/Components/SelectPhoneRegion";
import SelectRole from "@/Components/SelectRole";
import { UserContext } from "@/Contexts/UserProvider";
import { isRoleTopAdmin } from "@/constants/roleType";
import { noWhiteSpace } from "@/rules/noWhiteSpace";
import { passwordRule } from "@/rules/passwordRule";
import { phoneRule } from "@/rules/phoneRule";
import { UserService } from "@/services/UserService";
import { IUser } from "@/types/IUser";
import { notificationResponseError } from "@/utils/notificationResponseError";
import { Form, Input, Modal, Space, Switch, notification } from "antd";
import QueryString from "qs";
import { useContext, useState } from "react";

const AddUser = ({
  show,
  handleCancel,
  onSaveSuccess,
}: {
  show: boolean;
  handleCancel(): void;
  onSaveSuccess(): void;
}) => {
  // pageTitle("Thêm - Người dùng - Quản trị");
  const { user: me } = useContext(UserContext);

  const [notifyApi, contextHolder] = notification.useNotification();

  const [form] = Form.useForm();
  const national_number = Form.useWatch(["phone", "national_number"], form);
  const email = Form.useWatch(["email", "email"], form);

  const [saving, setSaving] = useState(false);

  async function handleFinish(values: IUser): Promise<void> {
    console.log(`🚀 ~ handleFinish ~ values:`, values);

    setSaving(true);
    // const { phone, email, gender, role, ...rest } = values;
    const { phone, email, gender, role, ...rest } = values;

    const body: any = rest;

    body.tell = phone?.national_number;
    body.region_code = phone?.region_code;
    body.tell_verify = phone?.verified;

    body.email = email?.email;
    body.email_verify = email?.verified;

    body.gender = gender?.title;
    body.role = role?.title;

    console.log(`🚀 ~ handleFinish ~ body:`, body);

    try {
      const payload = QueryString.parse(QueryString.stringify(body));
      console.log(
        `🚀 ~ handleFinish ~ QueryString.stringify(body):`,
        QueryString.stringify(body),
      );

      console.log(`🚀 ~ handleFinish ~ payload:`, payload);

      const d = await UserService.create(payload);

      onSaveSuccess();
      form.resetFields();
    } catch (error) {
      console.log(`🚀 ~ handleFinish ~ error:`, error);
      notificationResponseError({
        error,
        message: "Lỗi gửi mã",
        notification: notifyApi,
      });
    }
    setSaving(false);
  }

  return (
    <Modal
      title="Sửa"
      open={show}
      okButtonProps={{
        hidden: true,
      }}
      cancelButtonProps={{
        hidden: true,
      }}
      onCancel={handleCancel}
      confirmLoading={saving}
    >
      {contextHolder}
      <Form<IUser> onFinish={handleFinish} form={form}>
        <Form.Item<IUser>
          name={"username"}
          label="Username"
          rules={noWhiteSpace}
        >
          <Input />
        </Form.Item>
        <Form.Item<IUser>
          name={"password"}
          label="Password"
          rules={passwordRule}
        >
          <Input />
        </Form.Item>
        <Form.Item<IUser> name={"first_name"} label="Tên" rules={noWhiteSpace}>
          <Input />
        </Form.Item>
        <Form.Item<IUser> name={"last_name"} label="Họ & tên đệm">
          <Input />
        </Form.Item>

        <Form.Item<IUser> name={["gender", "title"]} label="Giới tính">
          <SelectGender />
        </Form.Item>
        <Form.Item<IUser> name={["role", "title"]} label="Vai trò">
          <SelectRole
            disableRoles={
              (!isRoleTopAdmin(me?.role?.title) && ["admin", "admin_lvl_2"]) ||
              undefined
            }
          />
        </Form.Item>

        <Form.Item<IUser>
          name={["phone", "national_number"]}
          label="Phone"
          rules={phoneRule}
          dependencies={[["phone", "region_code"]]}
        >
          <Input
            addonBefore={
              <Form.Item<IUser> name={["phone", "region_code"]} noStyle>
                <SelectPhoneRegion />
              </Form.Item>
            }
          />
        </Form.Item>
        <Form.Item<IUser>
          name={["phone", "verified"]}
          label="Phone xác thực"
          valuePropName="checked"
        >
          <Switch disabled={!national_number} />
        </Form.Item>

        <Form.Item<IUser> name={["email", "email"]} label="Mail">
          <Input />
        </Form.Item>
        <Form.Item<IUser>
          name={["email", "verified"]}
          label="Mail xác thực"
          valuePropName="checked"
        >
          <Switch disabled={!email} />
        </Form.Item>

        <Space className="flex justify-end">
          <MyButton onClick={() => form.resetFields()}>Reset</MyButton>
          <MyButton htmlType="submit" type="primary">
            Thêm
          </MyButton>
        </Space>
      </Form>
    </Modal>
  );
};

export default AddUser;
