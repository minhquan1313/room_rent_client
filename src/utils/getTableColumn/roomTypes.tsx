import { IRoomType } from "@/types/IRoomType";
import { dateFormat } from "@/utils/dateFormat";
import { ColumnsType } from "antd/es/table";

type Props = {
  //
};

export function roomTypes(): ColumnsType<IRoomType> {
  return [
    {
      title: "Key",
      dataIndex: "title",
      width: 100,
      fixed: "left",
      // sorter: true,
      // ...filterCustom({ placeholder: "Tìm tên đăng" }),
      // render(value, record) {
      //   return (
      //     <Link
      //       to={`${routeRoomDetail}/${record._id}`}
      //       state={{ room: record }}
      //     >
      //       {value}
      //     </Link>
      //   );
      // },
    },
    {
      title: "Tên",
      dataIndex: "display_name",
      width: 300,
      // sorter: true,
      // ...filterCustom({ placeholder: "Tìm tên đăng" }),
      // render(value, record) {
      //   return (
      //     <Link
      //       to={`${routeRoomDetail}/${record._id}`}
      //       state={{ room: record }}
      //     >
      //       {value}
      //     </Link>
      //   );
      // },
    },
    {
      title: "Cập nhật",
      dataIndex: "updatedAt",
      width: 200,
      sorter: (a, b) => {
        const aDate = dateFormat(a.updatedAt);
        const bDate = dateFormat(b.updatedAt);
        return aDate.diff(bDate);
      },
      render: (value) => dateFormat(value).format("LLL"),
    },
    {
      title: "Tạo lúc",
      dataIndex: "createdAt",
      width: 200,
      sorter: (a, b) => {
        const aDate = dateFormat(a.updatedAt);
        const bDate = dateFormat(b.updatedAt);
        return aDate.diff(bDate);
      },
      render: (value) => dateFormat(value).format("LLL"),
    },
  ];
}
