import MyButton from "@/Components/MyButton";
import ServerErrorResponse from "@/Components/ServerResponse/ServerErrorResponse";
import { RoomSvCateService } from "@/services/RoomSvCateService";
import { IRoomServiceCategory } from "@/types/IRoomServiceCategory";
import { autoTitle } from "@/utils/autoTitle";
import logger from "@/utils/logger";
import { trimObjectValues } from "@/utils/trimObjectValues";
import { Form, Input, Modal, Space, message } from "antd";
import QueryString from "qs";
import { memo, useState } from "react";

export interface AddRoomServiceCateProps {
  open?: boolean;
  handleCancel(): void;
  onSaveSuccess(): void;
}

type TField = IRoomServiceCategory;

const AddRoomServiceCate = memo(function AddRoomServiceCate(
  props: AddRoomServiceCateProps,
) {
  const {
    open,

    handleCancel,
    onSaveSuccess,
  } = props;

  const [notifyApi, contextHolder] = message.useMessage();

  const [form] = Form.useForm();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<unknown>();

  async function handleFinish(body: TField): Promise<void> {
    setSaving(true);
    setError(undefined);
    try {
      const payload = trimObjectValues(
        QueryString.parse(QueryString.stringify(body, { encode: false })),
      );
      logger(`🚀 ~ handleFinish ~ payload:`, payload);

      await RoomSvCateService.create(payload);

      onSaveSuccess();
      notifyApi.success({
        content: "Lưu thành công",
      });

      form.resetFields();
    } catch (error) {
      logger(`🚀 ~ handleFinish ~ error:`, error);
      setError((error as any)?.response?.data);
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

      <ServerErrorResponse errors={error} mode="notification" />

      <Form<TField>
        form={form}
        onFinish={handleFinish}
        onValuesChange={(e: TField) => {
          if (e.display_name) {
            form.setFieldValue("title", autoTitle(e.display_name));
          }
        }}
      >
        <Form.Item<TField>
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
        <Form.Item<TField>
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
});

export default AddRoomServiceCate;
