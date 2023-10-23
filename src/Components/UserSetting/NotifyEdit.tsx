import { NotificationContext } from "@/Contexts/NotificationProvider";
import { UserContext } from "@/Contexts/UserProvider";
import { Alert, Form, Space, Switch, Typography, message } from "antd";
import { useContext, useEffect, useState } from "react";

const NotifyEdit = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const { user } = useContext(UserContext);
  const { denied, enabling, register, unRegister } =
    useContext(NotificationContext);

  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();
  console.log(`🚀 ~ loading:`, loading);

  useEffect(() => {
    //
  }, []);

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
              onChange={async (e) => {
                console.log(`🚀 ~ onFinish={ ~ e:`, e);
                setLoading(true);
                if (e) {
                  if (await register()) {
                    messageApi.open({
                      type: "success",
                      content: "Bật thông báo thành công!",
                    });
                  } else {
                    messageApi.open({
                      type: "error",
                      content: "Bật thông báo thất bại!",
                    });
                  }
                } else {
                  await unRegister();
                }
                setLoading(false);
              }}
              // unCheckedChildren={locationDenied ? "Bị cấm" : "Gần đây"}
            />

            <Typography.Text disabled={denied}>
              Thông báo tin nhắn đến
            </Typography.Text>
          </Space>

          {denied && (
            <Alert
              type="warning"
              message="Bạn đã từ chối cấp quyền thông báo, hãy vào cài đặt cấp lại quyền"
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
              console.log(`🚀 ~ onFinish={ ~ e:`, e);
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
              console.log(`🚀 ~ onFinish={ ~ e:`, e);
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
