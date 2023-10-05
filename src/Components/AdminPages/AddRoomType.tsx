import MyButton from "@/Components/MyButton";
import { RoomTypeService } from "@/services/RoomTypeService";
import { IRoomType } from "@/types/IRoomType";
import { autoTitle } from "@/utils/autoTitle";
import { notificationResponseError } from "@/utils/notificationResponseError";
import { trimObjectValues } from "@/utils/trimObjectValues";
import { Form, Input, Modal, Space, notification } from "antd";
import { useState } from "react";

type TData = IRoomType;
const AddRoomType = ({
  open,
  handleCancel,
  onSaveSuccess,
}: {
  open?: boolean;
  handleCancel(): void;
  onSaveSuccess(): void;
}) => {
  const [notifyApi, contextHolder] = notification.useNotification();

  const [form] = Form.useForm();

  const [saving, setSaving] = useState(false);

  async function handleFinish(body: TData): Promise<void> {
    setSaving(true);
    try {
      const payload = trimObjectValues(body);

      await RoomTypeService.create(payload);

      onSaveSuccess();
      notifyApi.success({
        message: "Lưu thành công",
        description: `Lưu thành công như sẽ cập nhật sau vài phút (Server có cache) :>`,
        duration: 30,
      });

      form.resetFields();
    } catch (error) {
      console.log(`🚀 ~ handleFinish ~ error:`, error);
      notificationResponseError({
        error,
        notification: notifyApi,
      });
    }
    setSaving(false);
  }

  return (
    <Modal
      title="Tạo"
      open={open}
      okButtonProps={{
        hidden: true,
      }}
      cancelButtonProps={{
        hidden: true,
      }}
      onCancel={handleCancel}
    >
      {contextHolder}
      <Form<TData>
        form={form}
        onFinish={handleFinish}
        onValuesChange={(e: TData) => {
          if (e.display_name) {
            form.setFieldValue("title", autoTitle(e.display_name));
          }
        }}
      >
        <Form.Item<TData>
          name={"title"}
          label="Key"
          rules={[
            {
              required: true,
              message: "Không được bỏ trống",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item<TData>
          name={"display_name"}
          label="Tên"
          rules={[
            {
              required: true,
              message: "Không được bỏ trống",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Space className="flex justify-end">
          <MyButton onClick={() => form.resetFields()}>Reset</MyButton>
          <MyButton htmlType="submit" type="primary" loading={saving}>
            Tạo
          </MyButton>
        </Space>
      </Form>
    </Modal>
  );
};

export default AddRoomType;
