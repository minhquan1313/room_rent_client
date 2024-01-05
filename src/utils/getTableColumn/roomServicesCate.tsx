import { IRoomServiceCategory } from "@/types/IRoomServiceCategory";
import { dateFormat } from "@/utils/dateFormat";
import { ColumnsType } from "antd/es/table";

export function roomServicesCate(): ColumnsType<IRoomServiceCategory> {
  return [
    {
      title: "Key",
      dataIndex: "title",
      width: 100,
      fixed: "left",
    },
    {
      title: "Tên",
      dataIndex: "display_name",
      width: 300,
      sorter: (a, b) =>
        a.display_name?.localeCompare(b.display_name || "") || 0,
      render(value) {
        return value;
      },
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
