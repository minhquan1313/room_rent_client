import { IRoom } from "@/types/IRoom";
import { blue, gold, gray, red } from "@ant-design/colors";
import { ClockCircleOutlined } from "@ant-design/icons";
import { Tag } from "antd";
import { memo } from "react";
import { useTranslation } from "react-i18next";

export interface RoomStateTagsProps {
  //
  room: IRoom;
}

const RoomStateTags = memo(function RoomStateTags(props: RoomStateTagsProps) {
  const {
    room: { is_visible, disabled, verified, verified_real },
  } = props;
  const { t } = useTranslation();
  const { t: tApi } = useTranslation("api");

  return (
    <>
      {disabled && (
        <Tag color={red[5]} icon={<ClockCircleOutlined />}>
          {tApi("data code.room.disabled")}
        </Tag>
      )}

      {!is_visible && (
        <Tag key={gray[5]} color={gray[5]} icon={<ClockCircleOutlined />}>
          {t("Room detail.Invisible")}
        </Tag>
      )}

      {verified_real && (
        <Tag color={gold[5]} icon={<ClockCircleOutlined />}>
          {tApi("data code.room.verified_real")}
        </Tag>
      )}

      {!verified && (
        <Tag color={blue[5]} icon={<ClockCircleOutlined />}>
          {t("Room detail.Not verified")}
        </Tag>
      )}
    </>
  );
});

export default RoomStateTags;
