import MyButton from "@/Components/MyButton";
import SelectServiceCategory from "@/Components/SelectServiceCategory";
import ServerErrorResponse from "@/Components/ServerResponse/ServerErrorResponse";
import { noEmptyRule } from "@/rules/noEmptyRule";
import { RoomSvService } from "@/services/RoomSvService";
import { IRoomService } from "@/types/IRoomService";
import { autoTitle } from "@/utils/autoTitle";
import logger from "@/utils/logger";
import { trimObjectValues } from "@/utils/trimObjectValues";
import { Form, Input, Modal, Space, message } from "antd";
import QueryString from "qs";
import { memo, useState } from "react";

export interface AddRoomServiceProps {
  open?: boolean;
  handleCancel(): void;
  onSaveSuccess(): void;
}

type TField = IRoomService;

const AddRoomService = memo(function AddRoomService(
  props: AddRoomServiceProps,
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

      await RoomSvService.create(payload);

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
        <Form.Item<TField> name={"title"} label="Key" rules={[noEmptyRule()]}>
          <Input />
        </Form.Item>
        <Form.Item<TField>
          name={"display_name"}
          label="Tên"
          rules={[noEmptyRule()]}
        >
          <Input />
        </Form.Item>

        <Form.Item<TField> name={["category", "title"]} label="Loại">
          <SelectServiceCategory />
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

export default AddRoomService;
