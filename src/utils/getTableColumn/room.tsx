import MyImage from "@/Components/MyImage";
import { routeRoomDetail, routeUserDetail } from "@/constants/route";
import { IRoom } from "@/types/IRoom";
import { ServicesInCategory } from "@/types/IRoomService";
import { IRoomType } from "@/types/IRoomType";
import { dateFormat } from "@/utils/dateFormat";
import { filterCustom } from "@/utils/getTableColumn/filterCustom";
import { numberFormat } from "@/utils/numberFormat";
import { Image, Switch, Table, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import { Link } from "react-router-dom";

type Props = {
  visibleLoading?: IRoom;
  onVisibleChange(room: IRoom, v: boolean): void;

  disabledLoading?: IRoom;
  onDisabledChange(room: IRoom, v: boolean): void;

  verifiedRealLoading?: IRoom;
  onVerifiedRealChange(room: IRoom, v: boolean): void;

  verifiedLoading?: IRoom;
  onVerifiedChange(room: IRoom, v: boolean): void;

  roomServicesConverted?: ServicesInCategory[];
  roomTypes?: IRoomType[];
  provincesAvailable?: string[];
  districtsAvailable?: string[];
};

export function room(arg: Props): ColumnsType<IRoom> {
  return [
    {
      title: "Tên",
      dataIndex: "name",
      width: 250,
      fixed: "left",
      sorter: true,
      ...filterCustom({ placeholder: "Tìm tên đăng" }),
      render(value, record) {
        return (
          <Link
            to={`${routeRoomDetail}/${record._id}`}
            state={{ room: record }}
          >
            {value}
          </Link>
        );
      },
    },
    Table.EXPAND_COLUMN,
    {
      title: "ID",
      dataIndex: "_id",
      width: 150,
      ...filterCustom({ placeholder: "Tìm ID" }),
      render(value) {
        return <Typography.Text copyable>{value}</Typography.Text>;
      },
    },
    {
      title: "ID chủ",
      dataIndex: "owner",
      width: 150,
      sorter: true,
      ...filterCustom({ placeholder: "Tìm ID chủ phòng" }),
      render(value) {
        return (
          <Typography.Text
            copyable={{
              text: value,
            }}
          >
            <Link to={`${routeUserDetail}/${value}`}>{value} </Link>
          </Typography.Text>
        );
      },
    },
    {
      title: "Ảnh",
      dataIndex: "images",
      width: 200,
      sorter: true,
      render(value: IRoom["images"]) {
        return value[0] ? (
          <Image.PreviewGroup>
            {/* <MyImage
              src={value[0].image}
              addServer
              width={100}
              height={100}
              className="object-contain"
            /> */}
            {value.map(({ image }, i) => (
              <MyImage
                key={image}
                src={image}
                addServer
                width={100}
                height={100}
                hidden={i !== 0}
                className="object-contain"
              />
            ))}{" "}
            x {value.length}
          </Image.PreviewGroup>
        ) : (
          <div style={{ height: 100 }} />
        );
      },
    },
    {
      title: "Loại",
      dataIndex: "room_type",
      width: 200,
      sorter: true,
      filters: arg.roomTypes
        ? arg.roomTypes.map(({ display_name, title }) => ({
            text: display_name,
            value: title,
          }))
        : [],
      render(value: IRoom["room_type"]) {
        return value?.display_name;
      },
    },
    // {
    //   title: "Quốc gia",
    //   dataIndex: "country",
    //   width: 200,
    //   sorter: true,
    // },
    {
      title: "Tỉnh",
      dataIndex: "province",
      width: 200,
      sorter: true,
      filters: arg.provincesAvailable
        ? arg.provincesAvailable.map((text) => ({
            text,
            value: text,
          }))
        : [],
    },
    {
      title: "Thành phố",
      dataIndex: "district",
      width: 200,
      sorter: true,
    },
    {
      title: "Phường",
      dataIndex: "ward",
      width: 200,
      sorter: true,
    },
    {
      title: "Giá",
      dataIndex: "price_per_month",
      width: 200,
      sorter: true,
      render(value) {
        return numberFormat(value);
      },
    },
    {
      title: "Diện tích",
      dataIndex: "usable_area",
      width: 200,
      sorter: true,
      render(value) {
        return numberFormat(value);
      },
    },
    {
      title: "P.Khách",
      dataIndex: "number_of_living_room",
      width: 100,
      sorter: true,
      render(value) {
        return numberFormat(value);
      },
    },
    {
      title: "P.Ngủ",
      dataIndex: "number_of_bedroom",
      width: 100,
      sorter: true,
      render(value) {
        return numberFormat(value);
      },
    },
    {
      title: "P.Tắm",
      dataIndex: "number_of_bathroom",
      width: 100,
      sorter: true,
      render(value) {
        return numberFormat(value);
      },
    },
    {
      title: "Tầng",
      dataIndex: "number_of_floor",
      width: 100,
      sorter: true,
      render(value) {
        return numberFormat(value);
      },
    },
    {
      title: "Hiển thị",
      dataIndex: "is_visible",
      width: 150,
      sorter: true,
      filterMultiple: false,
      filters: [
        {
          text: "Đang hiện",
          value: true,
        },
        {
          text: "Đang ẩn",
          value: false,
        },
      ],
      render: (value, record) => {
        return (
          <Switch
            checked={value}
            loading={arg.visibleLoading === record}
            onChange={(e) => arg.onVisibleChange(record, e)}
          />
        );
      },
    },
    {
      title: "Cấm",
      dataIndex: "disabled",
      width: 150,
      sorter: true,
      filterMultiple: false,
      filters: [
        {
          text: "Đã cấm",
          value: true,
        },
        {
          text: "Chưa cấm",
          value: false,
        },
      ],
      render: (value, record) => {
        return (
          <Switch
            checked={value}
            loading={arg.disabledLoading === record}
            onChange={(e) => arg.onDisabledChange(record, e)}
          />
        );
      },
    },
    {
      title: "Xác thực tế",
      dataIndex: "verified_real",
      width: 150,
      sorter: true,
      filterMultiple: false,
      filters: [
        {
          text: "Đã xác thực",
          value: true,
        },
        {
          text: "Chưa xác thực",
          value: false,
        },
      ],
      render: (value, record) => {
        return (
          <Switch
            checked={value}
            loading={arg.verifiedRealLoading === record}
            onChange={(e) => arg.onVerifiedRealChange(record, e)}
          />
        );
      },
    },
    {
      title: "Xác thực",
      dataIndex: "verified",
      width: 150,
      sorter: true,
      filterMultiple: false,
      filters: [
        {
          text: "Đã xác thực",
          value: true,
        },
        {
          text: "Chưa xác thực",
          value: false,
        },
      ],
      render: (value, record) => {
        return (
          <Switch
            checked={value}
            loading={arg.verifiedLoading === record}
            onChange={(e) => arg.onVerifiedChange(record, e)}
          />
        );
      },
    },
    {
      title: "Cập nhật",
      dataIndex: "updatedAt",
      width: 200,
      sorter: true,
      render: (value) => dateFormat(value).format("LLL"),
    },
    {
      title: "Tạo lúc",
      dataIndex: "createdAt",
      width: 200,
      sorter: true,
      render: (value) => dateFormat(value).format("LLL"),
    },
  ];
}
