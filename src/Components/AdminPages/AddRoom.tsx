import RoomAdd from "@/Pages/RoomAdd";
import { Modal } from "antd";

interface Props {
  open?: boolean;
  handleCancel(): void;
  onSaveSuccess(): void;
}
const AddRoom = ({ open, handleCancel, onSaveSuccess }: Props) => {
  // pageTitle("Chỉnh sửa - Tất cả phòng - Quản trị");

  return (
    <Modal
      title="Thêm"
      open={open}
      okButtonProps={{
        hidden: true,
      }}
      cancelButtonProps={{
        hidden: true,
      }}
      onCancel={handleCancel}
      width={800}
    >
      <RoomAdd onSaveSuccess={onSaveSuccess} />
    </Modal>
  );
};

export default AddRoom;
