import FilesUpload, { FilesUploadRef } from "@/Components/FilesUpload";
import MyButton from "@/Components/MyButton";
import MyContainer from "@/Components/MyContainer";
import PhoneOTP from "@/Components/PhoneOTP";
import SelectGender from "@/Components/SelectGender";
import SelectPhoneRegion from "@/Components/SelectPhoneRegion";
import { UserContext } from "@/Contexts/UserProvider";
import { isRoleOwner } from "@/constants/roleType";
import { passwordRule } from "@/rules/passwordRule";
import { phoneRule } from "@/rules/phoneRule";
import { fetcher } from "@/services/fetcher";
import { ErrorJsonResponse } from "@/types/ErrorJsonResponse";
import { IUser } from "@/types/IUser";
import { pageTitle } from "@/utils/pageTitle";
import { toStringUserName } from "@/utils/toString";
import {
  CheckCircleFilled,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Form,
  Grid,
  Input,
  Space,
  Tabs,
  Tooltip,
  Typography,
  message,
  notification,
  theme,
} from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

type TField = Partial<IUser> & {
  old_password?: string;
  passwordConfirm?: string;

  file?: File;
  file_to?: "avatar" | "banner";
};
const UserEdit = () => {
  const { user } = useContext(UserContext);
  const [query, setQuery] = useSearchParams();
  const screens = Grid.useBreakpoint();

  pageTitle(toStringUserName(user) || "Đang tải");

  useEffect(() => {
    screens;
    console.log(`🚀 ~ useEffect ~ screens:`, screens);

    // if (!query.get("tab")) setQuery(`tab=avatar`);
  }, [screens]);

  return (
    <MyContainer className="flex min-h-full py-5">
      {user && (
        // <div className=" flex gap-2">
        <Tabs
          items={[
            {
              label: `Hình ảnh`,
              key: "avatar",
              children: <AvatarEdit />,
            },
            {
              label: `Thông tin`,
              key: "info",
              children: <NormalInfoEdit />,
            },
            {
              label: `Mật khẩu`,
              key: "password",
              children: <PasswordEdit />,
            },
          ]}
          onChange={(e) => {
            setQuery(`tab=${e}`);
          }}
          activeKey={query.get("tab") || undefined}
          tabPosition={screens.xs ? "top" : "left"}
          className="min-h-full w-full"
          animated
          centered
        />
        // </div>
      )}
    </MyContainer>
  );
};

const AvatarEdit = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const { user, refresh } = useContext(UserContext);

  const avatar = useRef<FilesUploadRef>(null);
  const banner = useRef<FilesUploadRef>(null);

  const [uploading, setUploading] = useState(false);

  if (!user) return null;

  return (
    <Form
      onFinish={async (e: TField) => {
        console.log(`🚀 ~ AvatarEdit ~ e:`, e);
        avatar;
        console.log(`🚀 ~ AvatarEdit ~ avatar:`, avatar);

        if (!avatar.current?.files.length && !banner.current?.files.length)
          return;

        let partialSuccess = false;
        setUploading(true);

        if (avatar.current?.files.length) {
          //
          try {
            const payload: TField = {
              file_to: "avatar",
              file: avatar.current.files[0],
            };
            console.log(`🚀 ~ AvatarEdit ~ payload:`, payload);

            await fetcher.patchForm(`/users/${user._id}`, payload);

            partialSuccess = true;

            messageApi.open({
              type: "success",
              content: "Cập nhật avatar thành công!",
            });
          } catch (error) {
            messageApi.open({
              type: "error",
              content: "Có lỗi khi up avatar!",
            });
          }
        }
        if (banner.current?.files.length) {
          //
          try {
            const payload: TField = {
              file_to: "banner",
              file: banner.current.files[0],
            };
            console.log(`🚀 ~ AvatarEdit ~ payload:`, payload);

            await fetcher.patchForm(`/users/${user._id}`, payload);

            partialSuccess = true;

            messageApi.open({
              type: "success",
              content: "Cập nhật banner thành công!",
            });
          } catch (error) {
            console.log(`🚀 ~ onFinish={ ~ error:`, error);

            messageApi.open({
              type: "error",
              content: "Có lỗi khi up banner!",
            });
          }
        }

        partialSuccess && refresh();
        setUploading(false);

        banner;
        console.log(`🚀 ~ AvatarEdit ~ banner:`, banner);
      }}
      initialValues={user}
      layout="vertical"
      className="min-h-full w-full"
    >
      {contextHolder}
      {isRoleOwner(user.role.title) && (
        <Form.Item<TField> label="Chọn banner mới">
          <FilesUpload
            ref={banner}
            multiple={false}
            imageAspect="aspect-video"
            accept="image/*"
          />
        </Form.Item>
      )}

      <Form.Item<TField> label="Chọn ảnh mới" className="mx-auto max-w-sm">
        <FilesUpload ref={avatar} multiple={false} avatar accept="image/*" />
      </Form.Item>

      <Form.Item>
        <MyButton
          block
          type="primary"
          loading={uploading}
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
const NormalInfoEdit = () => {
  const {
    token: { colorSuccess },
  } = theme.useToken();
  const [messageApi, contextHolder] = message.useMessage();
  const [notiApi, contextNotiHolder] = notification.useNotification();

  const [query, setQuery] = useSearchParams();

  const { user, refresh } = useContext(UserContext);

  const [error, setError] = useState<ErrorJsonResponse>();
  const [sendingCode, setSendingCode] = useState(false);

  useEffect(() => {
    if (!user?.phone?.verified || !query.get("step")) return;

    query.delete("step");
    setQuery(query);
  }, [query, user?.phone?.verified]);

  if (!user) return null;
  return (
    <Form
      onFinish={async (e: TField) => {
        const { first_name, last_name, phone, gender } = e;
        console.log(`🚀 ~ NormalInfoEdit ~ e:`, e);
        setError(undefined);

        const payload: { [key: string]: any } = {};
        if (phone?.national_number !== user.phone?.national_number) {
          payload.tell = phone?.national_number;
          payload.region_code = phone?.region_code;
        }

        if (gender?.title !== user.gender.title) {
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

          refresh();
        } catch (error: any) {
          console.log(`🚀 ~ error:`, error);

          const e = error.response.data as ErrorJsonResponse;
          notiApi.open({
            type: "error",
            duration: 0,
            message: "Cập nhật thất bại!",
            description: e.error.map(({ msg }) => (
              <div key={msg}>
                <Typography.Text>{msg}</Typography.Text>
              </div>
            )),
          });
          setError(e);
        }
      }}
      initialValues={user}
      labelCol={{
        xs: { span: 24 },
        sm: { span: 6 },
      }}
      className="w-full"
      // size="large"
    >
      {contextHolder}
      {contextNotiHolder}
      <Form.Item<TField> name={"last_name"} label="Họ">
        <Input />
      </Form.Item>

      <Form.Item<TField>
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

      <Form.Item<TField> name={["gender", "title"]} label="Giới tính">
        <SelectGender />
      </Form.Item>

      <Form.Item<TField>
        label="Điện thoại"
        tooltip={
          user.phone?.verified &&
          "Số điện thoại đã xác thực không thể thay đổi!"
        }
      >
        <Space direction="vertical" className="w-full">
          <Form.Item<TField>
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
                <Form.Item<TField> name={["phone", "region_code"]} noStyle>
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
                  >
                    Nhập mã xác thực
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
                    Gửi mã xác thực
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
const PasswordEdit = () => {
  const [notifyApi, contextHolder] = notification.useNotification();
  const [messageApi, contextHolderMessage] = message.useMessage();

  const { user, refresh } = useContext(UserContext);

  const [error, setError] = useState<ErrorJsonResponse>();

  const [form] = Form.useForm();

  if (!user) return null;

  return (
    <Form
      onFinish={async (e: TField) => {
        setError(undefined);
        try {
          const d = await fetcher.patch(`/users/${user._id}`, e);
          console.log(`🚀 ~ PasswordEdit ~ d:`, d);

          console.log(`🚀 ~ NormalInfoEdit ~ e:`, e);
          messageApi.open({
            type: "success",
            content: "Cập nhật mật khẩu thành công!",
          });
          refresh();
          form.resetFields();
        } catch (error: any) {
          console.log(`🚀 ~ error:`, error);

          const e = error.response.data as ErrorJsonResponse;
          notifyApi.open({
            type: "error",
            duration: 0,
            message: "Cập nhật thất bại!",
            description: e.error.map(({ msg }) => (
              <div key={msg}>
                <Typography.Text>{msg}</Typography.Text>
              </div>
            )),
          });
          setError(e);
        }
      }}
      labelCol={{
        xs: { span: 24 },
        sm: { span: 7 },
      }}
      className="w-full"
      form={form}
    >
      {contextHolder}
      {contextHolderMessage}
      <Form.Item<TField>
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

      <Form.Item<TField>
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

      <Form.Item<TField>
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

export default UserEdit;
