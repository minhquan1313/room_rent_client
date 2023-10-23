import { IRoom } from "@/types/IRoom";
import { blue, gold, gray, red } from "@ant-design/colors";
import { ClockCircleOutlined } from "@ant-design/icons";
import { Tag } from "antd";
import { memo } from "react";

interface Props {
  room: IRoom;
}

const _ = ({
  room: { is_visible, disabled, verified, verified_real },
}: Props) => {
  // const count: JSX.Element[] = [];

  // if (disabled) {
  //   count.push(
  //     <Tag color={red[5]} icon={<ClockCircleOutlined />}>
  //       Vô hiệu hoá
  //     </Tag>,
  //   );
  // }
  // if (!is_visible) {
  //   count.push(
  //     <Tag key={gray[5]} color={gray[5]} icon={<ClockCircleOutlined />}>
  //       Đang ẩn
  //     </Tag>,
  //   );
  // }
  // if (verified_real) {
  //   count.push(
  //     <Tag color={gold[5]} icon={<ClockCircleOutlined />}>
  //       Xác thực
  //     </Tag>,
  //   );
  // }
  // if (!verified) {
  //   count.push(
  //     <Tag color={blue[5]} icon={<ClockCircleOutlined />}>
  //       Chưa xác thực
  //     </Tag>,
  //   );
  // }

  return (
    <>
      {disabled && (
        <Tag color={red[5]} icon={<ClockCircleOutlined />}>
          Vô hiệu hoá
        </Tag>
      )}

      {!is_visible && (
        <Tag key={gray[5]} color={gray[5]} icon={<ClockCircleOutlined />}>
          Đang ẩn
        </Tag>
      )}

      {verified_real && (
        <Tag color={gold[5]} icon={<ClockCircleOutlined />}>
          Xác thực
        </Tag>
      )}

      {!verified && (
        <Tag color={blue[5]} icon={<ClockCircleOutlined />}>
          Chưa xác thực
        </Tag>
      )}
    </>
  );
};
const RoomStateTags = memo(_);
export default RoomStateTags;
