import MyButton from "@/Components/MyButton";
import ServerErrorResponse from "@/Components/ServerResponse/ServerErrorResponse";
import { RoomSvCateService } from "@/services/RoomSvCateService";
import { IRoomServiceCategory } from "@/types/IRoomServiceCategory";
import logger from "@/utils/logger";
import { trimObjectValues } from "@/utils/trimObjectValues";
import { Form, Input, Modal, Space, message } from "antd";
import { useEffect, useState } from "react";

type TData = IRoomServiceCategory;

const EditRoomServiceCate = ({
  item,
  handleCancel,
  onSaveSuccess,
}: {
  item?: TData;
  handleCancel(): void;
  onSaveSuccess(): void;
}) => {
  const [notifyApi, contextHolder] = message.useMessage();

  const [form] = Form.useForm();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<unknown>();

  async function handleFinish(body: TData): Promise<void> {
    if (!item?._id) return;
    setSaving(true);
    setError(undefined);
    try {
      const payload = trimObjectValues(body);

      await RoomSvCateService.update(item._id, payload);

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
      <ServerErrorResponse errors={error} mode="notification" />
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

export default EditRoomServiceCate;
