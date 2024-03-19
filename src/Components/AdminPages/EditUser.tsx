import FilesUpload, {
  ImagesUploadRef,
} from "@/Components/FilesUpload/ImagesUpload";
import MyButton from "@/Components/MyButton";
import SelectGender from "@/Components/SelectGender";
import SelectPhoneRegion from "@/Components/SelectPhoneRegion";
import SelectRole from "@/Components/SelectRole";
import ServerErrorResponse from "@/Components/ServerResponse/ServerErrorResponse";
import { UserContext } from "@/Contexts/UserProvider";
import { bannerAspect } from "@/constants/bannerAspect";
import { isRoleOwner, isRoleTopAdmin } from "@/constants/roleType";
import { noWhiteSpaceRule } from "@/rules/noWhiteSpace";
import { phoneRules } from "@/rules/phoneRules";
import { UserService } from "@/services/UserService";
import { IUser } from "@/types/IUser";
import logger from "@/utils/logger";
import { Form, Input, Modal, Space, Switch, message } from "antd";
import QueryString from "qs";
import { useContext, useEffect, useRef, useState } from "react";

const EditUser = ({
  user,
  handleCancel,
  onSaveSuccess,
}: {
  user?: IUser;
  handleCancel(): void;
  onSaveSuccess(): void;
}) => {
  // pageTitle("Chỉnh sửa - Người dùng - Quản trị");
  const { user: me } = useContext(UserContext);

  const [notifyApi, contextHolder] = message.useMessage();

  const [form] = Form.useForm();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<unknown>();

  const avatarRef = useRef<ImagesUploadRef>(null);
  const bannerRef = useRef<ImagesUploadRef>(null);

  async function handleFinish(values: IUser): Promise<void> {
    if (!user?._id) return;
    setSaving(true);
    setError(undefined);

    try {
      logger(`🚀 ~ handleFinish ~ values:`, values);
      const { phone, email, gender, role, ...rest } = values;

      const body: any = rest;

      logger(`🚀 ~ handleFinish ~ body:`, body);

      if (phone?.national_number !== user.phone?.national_number) {
        body.tell = phone?.national_number;
        body.region_code = phone?.region_code;
      }
      body.tell_verify = phone?.verified;

      if (email?.email !== user.email?.email) {
        body.email = email?.email;
      }
      body.email_verify = email?.verified;

      body.gender = gender?.title;
      body.role = role?.title;

      if (avatarRef.current?.files.length) {
        await UserService.update(user._id, {
          file_to: "avatar",
          file: avatarRef.current.files[0],
        });
      }

      if (bannerRef.current?.files.length) {
        await UserService.update(user._id, {
          file_to: "banner",
          file: bannerRef.current.files[0],
        });
      }

      const payload = QueryString.parse(QueryString.stringify(body));
      logger(`🚀 ~ handleFinish ~ payload:`, payload);

      const d = await UserService.update(user._id, payload);
      logger(`🚀 ~ handleFinish ~ d:`, d);
      onSaveSuccess();
      notifyApi.success({
        content: "Lưu thành công",
      });
    } catch (error) {
      logger(`🚀 ~ handleFinish ~ error:`, error);
      setError((error as any)?.response?.data);
    }
    setSaving(false);
  }

  useEffect(() => {
    setTimeout(() => {
      user?._id && form.resetFields();
    }, 100);
  }, [user?._id]);

  return (
    <Modal
      title="Sửa"
      open={!!user}
      // onOk={form.submit}
      // okType=""
      okButtonProps={{
        hidden: true,
      }}
      cancelButtonProps={{
        hidden: true,
      }}
      onCancel={() => {
        handleCancel();
      }}
      confirmLoading={saving}
    >
      {contextHolder}
      <ServerErrorResponse errors={error} mode="notification" />
      {user && (
        <Form<IUser>
          initialValues={user}
          key={user._id + user.updatedAt}
          form={form}
          onFinish={handleFinish}
        >
          <Form.Item<IUser> label="Ảnh">
            <FilesUpload
              ref={avatarRef}
              multiple={false}
              avatar
              accept="image/*"
            />
          </Form.Item>
          {isRoleOwner(user.role?.title) && (
            <Form.Item<IUser> label="Bìa">
              <FilesUpload
                ref={bannerRef}
                multiple={false}
                imageAspect={bannerAspect}
                accept="image/*"
              />
            </Form.Item>
          )}

          {/* <Form.Item<IUser> name={"username"} label="Username">
            <Input disabled />
          </Form.Item> */}
          <Form.Item<IUser>
            name={"first_name"}
            label="Tên"
            rules={[noWhiteSpaceRule()]}
          >
            <Input />
          </Form.Item>
          <Form.Item<IUser> name={"last_name"} label="Họ">
            <Input />
          </Form.Item>

          <Form.Item<IUser> name={["gender", "title"]} label="Giới tính">
            <SelectGender />
          </Form.Item>
          <Form.Item<IUser> name={["role", "title"]} label="Vai trò">
            <SelectRole
              disableRoles={
                (!isRoleTopAdmin(me?.role?.title) && [
                  "admin",
                  "admin_lvl_2",
                ]) ||
                undefined
              }
            />
          </Form.Item>

          <Form.Item<IUser>
            name={["phone", "national_number"]}
            label="Phone"
            rules={phoneRules()}
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
            <Switch disabled={!user.phone} />
          </Form.Item>

          <Form.Item<IUser> name={["email", "email"]} label="Mail">
            <Input />
          </Form.Item>
          <Form.Item<IUser>
            name={["email", "verified"]}
            label="Mail xác thực"
            valuePropName="checked"
          >
            <Switch disabled={!user.email} />
          </Form.Item>

          <Space className="flex justify-end">
            <MyButton onClick={() => form.resetFields()}>Reset</MyButton>
            <MyButton htmlType="submit" type="primary">
              Lưu
            </MyButton>
          </Space>
        </Form>
      )}
    </Modal>
  );
};

export default EditUser;
