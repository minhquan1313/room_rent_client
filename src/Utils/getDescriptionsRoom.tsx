import { IRoom } from "@/types/IRoom";
import { numberFormat } from "@/utils/numberFormat";
import { toStringLocation } from "@/utils/toString";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { DescriptionsProps, Tooltip } from "antd";
import { DescriptionsItemType } from "antd/es/descriptions";

export function getDescriptionsRoom(room: IRoom): DescriptionsItemType[] {
  const items: DescriptionsProps["items"] = [
    {
      key: "Địa chỉ",
      label: "Địa chỉ",
      children: room.location ? toStringLocation(room.location) : "",
      span: 3,
    },
    {
      key: "Diện tích sử dụng",
      label: "Diện tích sử dụng",
      children: room.usable_area + " m²",
    },
    {
      key: "Kiểu phòng",
      label: "Kiểu phòng",
      children: room.room_type.display_name,
      span: 2,
    },
    {
      key: "Số phòng tắm",
      label: "Số phòng tắm",
      children: room.number_of_bathroom,
    },
    {
      key: "Số phòng ngủ",
      label: "Số phòng ngủ",
      children: room.number_of_bedroom,
    },
    {
      key: "Số phòng khách",
      label: "Số phòng khách",
      children: room.number_of_living_room,
    },

    {
      key: "Số tầng",
      label: "Số tầng",
      children: room.number_of_floor,
    },
    {
      key: "Xác thực",
      label: "Xác thực",
      children: room.verified ? (
        <Tooltip title="Đã xác thực">
          <CheckCircleOutlined />
        </Tooltip>
      ) : (
        <Tooltip title="Chưa xác thực">
          <ExclamationCircleOutlined />
        </Tooltip>
      ),
      span: 2,
    },
    // {
    //   key: "Trạng thái",
    //   label: "Trạng thái",
    //   children: room.available ? (
    //     <Badge status="processing" text="Còn phòng" />
    //   ) : (
    //     <Badge status="warning" text="Hết phòng" />
    //   ),
    //   span: 2,
    // },
    {
      key: "Tiền thuê mỗi tháng",
      label: "Tiền thuê mỗi tháng",
      children:
        numberFormat(room.price_per_month) + " " + room.price_currency_code,
      span: 3,
    },
  ];

  return items;
}
