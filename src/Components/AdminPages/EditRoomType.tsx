import MyButton from "@/Components/MyButton";
import { RoomTypeService } from "@/services/RoomTypeService";
import { IRoomType } from "@/types/IRoomType";
import logger from "@/utils/logger";
import { notificationResponseError } from "@/utils/notificationResponseError";
import { trimObjectValues } from "@/utils/trimObjectValues";
import { Form, Input, Modal, Space, notification } from "antd";
import { useEffect, useState } from "react";

type TData = IRoomType;
const EditRoomType = ({
  item,
  handleCancel,
  onSaveSuccess,
}: {
  item?: TData;
  handleCancel(): void;
  onSaveSuccess(): void;
}) => {
  const [notifyApi, contextHolder] = notification.useNotification();

  const [form] = Form.useForm();

  const [saving, setSaving] = useState(false);

  async function handleFinish(body: TData): Promise<void> {
    if (!item?._id) return;
    setSaving(true);
    try {
      const payload = trimObjectValues(body);

      await RoomTypeService.update(item._id, payload);

      onSaveSuccess();
      notifyApi.success({
        message: `Lưu thành công như sẽ cập nhật sau vài phút (Server có cache) :>`,
        duration: 30,
      });
    } catch (error) {
      logger(`🚀 ~ handleFinish ~ error:`, error);
      notificationResponseError({
        error,
        message: "Lỗi gửi mã",
        notification: notifyApi,
      });
    }
    setSaving(false);
  }

  useEffect(() => {
    setTimeout(() => {
      item?._id && form.resetFields();
    }, 100);
  }, [item?._id]);

  return (
    <Modal
      title="Sửa"
      open={!!item}
      okButtonProps={{
        hidden: true,
      }}
      cancelButtonProps={{
        hidden: true,
      }}
      onCancel={handleCancel}
    >
      {contextHolder}
      {item && (
        <Form<TData>
          initialValues={item}
          key={item._id + item.updatedAt}
          form={form}
          onFinish={handleFinish}
        >
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
              Lưu
            </MyButton>
          </Space>
        </Form>
      )}
    </Modal>
  );
};

export default EditRoomType;
