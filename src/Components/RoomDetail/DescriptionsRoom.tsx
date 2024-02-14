import { IRoom } from "@/types/IRoom";
import { numberFormat } from "@/utils/numberFormat";
import { toStringCurrencyCode, toStringLocation } from "@/utils/toString";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Descriptions, Tooltip } from "antd";
import { memo } from "react";
import { useTranslation } from "react-i18next";

type Props = { room: IRoom };
const DescriptionsRoom = memo(({ room }: Props) => {
  const { t } = useTranslation();
  const { t: tApi } = useTranslation("api");

  return (
    <Descriptions
      bordered
      title={t("Room detail.Basic information")}
      items={[
        {
          key: "Địa chỉ",
          label: t("Room detail.Address"),
          children: room.location ? toStringLocation(room.location) : "",
          span: 3,
        },
        {
          key: "Diện tích sử dụng",
          label: t("Room detail.Usable area"),
          children: room.usable_area && numberFormat(room.usable_area) + " m²",
        },
        {
          key: "Kiểu phòng",
          label: t("Room detail.Room type"),
          children:
            room.room_type?.title &&
            tApi(`data code.room type.${room.room_type.title}`),
          span: 2,
        },
        {
          key: "Số phòng tắm",
          label: t("Room detail.Bathroom"),
          children: room.number_of_bathroom,
        },
        {
          key: "Số phòng ngủ",
          label: t("Room detail.Bedroom"),
          children: room.number_of_bedroom,
        },
        {
          key: "Số phòng khách",
          label: t("Room detail.Living room"),
          children: room.number_of_living_room,
        },

        {
          key: "Số tầng",
          label: t("Room detail.Floor"),
          children: room.number_of_floor,
        },
        {
          key: "Xác thực",
          label: t("Room detail.Verify"),
          children: room.verified ? (
            <Tooltip title={t("Room detail.Verified")}>
              <CheckCircleOutlined />
            </Tooltip>
          ) : (
            <Tooltip title={t("Room detail.Not verified")}>
              <ExclamationCircleOutlined />
            </Tooltip>
          ),
          span: 2,
        },
        // {
        //   key: "Trạng thái",
        //   label:t("Room detail.Status"),
        //   children: room.available ? (
        //     <Badge status="processing" text="Còn phòng" />
        //   ) : (
        //     <Badge status="warning" text="Hết phòng" />
        //   ),
        //   span: 2,
        // },
        {
          key: "Tiền thuê mỗi tháng",
          label: t("Room detail.Cost per month"),
          children:
            numberFormat(room.price_per_month) +
            " " +
            toStringCurrencyCode(room.price_currency_code),
          span: 3,
        },
      ]}
    />
  );
});

export default DescriptionsRoom;
