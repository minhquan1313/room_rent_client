import RoomAdd from "@/Pages/RoomAdd";
import { Modal } from "antd";
import { memo } from "react";

export interface AddRoomDashboardProps {
  open?: boolean;
  handleCancel(): void;
  onSaveSuccess(): void;
}

const AddRoomDashboard = memo(function AddRoomDashboard(
  props: AddRoomDashboardProps,
) {
  const {
    //
    open,
    handleCancel,
    onSaveSuccess,
  } = props;

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
});

export default AddRoomDashboard;
