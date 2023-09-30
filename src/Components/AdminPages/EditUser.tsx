import FilesUpload, { FilesUploadRef } from "@/Components/FilesUpload";
import MyButton from "@/Components/MyButton";
import SelectGender from "@/Components/SelectGender";
import SelectPhoneRegion from "@/Components/SelectPhoneRegion";
import SelectRole from "@/Components/SelectRole";
import { UserContext } from "@/Contexts/UserProvider";
import { bannerAspect } from "@/constants/bannerAspect";
import { isRoleOwner, isRoleTopAdmin } from "@/constants/roleType";
import { phoneRule } from "@/rules/phoneRule";
import { fetcher } from "@/services/fetcher";
import { IUser } from "@/types/IUser";
import { pageTitle } from "@/utils/pageTitle";
import { Form, Input, Modal, Switch } from "antd";
import { useContext, useRef, useState } from "react";

const EditUser = ({
  user,
  handleCancel,
  onSaveSuccess,
}: {
  user?: IUser;
  handleCancel(): void;
  onSaveSuccess(): void;
}) => {
  console.log(`🚀 ~ user:`, user);

  pageTitle("Chỉnh sửa - Người dùng - Quản trị");
  const { user: me } = useContext(UserContext);
  const [saving, setSaving] = useState(false);
  const avatarRef = useRef<FilesUploadRef>(null);
  const bannerRef = useRef<FilesUploadRef>(null);
  // const [form] = Form.useForm();

  function handleOk(): void {}

  async function handleFinish(values: IUser): Promise<void> {
    if (!user?._id) return;
    setSaving(true);
    console.log(`🚀 ~ handleFinish ~ values:`, values);
    const { phone, email, gender, role, ...rest } = values;

    const body: any = rest;

    console.log(`🚀 ~ handleFinish ~ body:`, body);

    if (phone?.national_number !== user.phone?.national_number) {
      body.tell = phone?.national_number;
      body.region_code = phone?.region_code;
    }
    body.tell_verify = phone?.verified;

    if (email?.email !== user.email?.email) {
      body.email = email?.email;
    }
    body.email_verify = email?.verified;

    body.gender = gender.title;
    body.role = role.title;

    try {
      avatarRef;
      console.log(`🚀 ~ handleFinish ~ avatarRef:`, avatarRef);
      if (avatarRef.current?.files.length) {
        await fetcher.patchForm(`/users/${user._id}`, {
          file_to: "avatar",
          file: avatarRef.current.files[0],
        });
      }

      bannerRef;
      console.log(`🚀 ~ handleFinish ~ bannerRef:`, bannerRef);
      if (bannerRef.current?.files.length) {
        await fetcher.patchForm(`/users/${user._id}`, {
          file_to: "banner",
          file: bannerRef.current.files[0],
        });
      }

      const d = await fetcher.patch(`/users/${user._id}`, body);
      console.log(`🚀 ~ handleFinish ~ d:`, d);
      onSaveSuccess();
    } catch (error) {
      console.log(`🚀 ~ handleFinish ~ error:`, error);
      //
    }
    setSaving(false);
  }

  // useEffect(() => {
  // form.setFieldsuser);
  // form.resetFields();
  // return () => {
  //   form.resetFields();
  // };
  // if (user?._id) return;
  // }, [user?._id]);

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
      onCancel={handleCancel}
      okText="Lưu"
      confirmLoading={saving}
      // maskClosable={false}
    >
      {user && (
        <Form<IUser>
          initialValues={user}
          key={user._id + user.updatedAt}
          // form={form}
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
          {isRoleOwner(user.role.title) && (
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
          <Form.Item<IUser> name={"first_name"} label="Tên">
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
                (!isRoleTopAdmin(me?.role.title) && ["admin", "admin_lvl_2"]) ||
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

          <div className="flex justify-end">
            <MyButton htmlType="submit" type="primary">
              Lưu
            </MyButton>
          </div>
        </Form>
      )}
    </Modal>
  );
};

export default EditUser;
