import RoomEdit from "@/Pages/RoomEdit";
import { IRoom } from "@/types/IRoom";
import { Modal } from "antd";

interface Props {
  room?: IRoom;
  handleCancel(): void;
  onSaveSuccess(): void;
}
const EditRoomDashboard = ({ room, handleCancel, onSaveSuccess }: Props) => {
  // pageTitle("Chỉnh sửa - Tất cả phòng - Quản trị");

  return (
    <Modal
      title="Sửa"
      open={!!room}
      okButtonProps={{
        hidden: true,
      }}
      cancelButtonProps={{
        hidden: true,
      }}
      onCancel={() => handleCancel()}
      width={800}
    >
      {room && (
        <RoomEdit
          key={room._id + room.updatedAt}
          room={room}
          onSaveSuccess={onSaveSuccess}
          floatSaveButton={false}
        />
      )}
    </Modal>
  );
};

export default EditRoomDashboard;
