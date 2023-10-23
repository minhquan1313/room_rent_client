import SelectServiceCategory from "@/Components/SelectServiceCategory";
import { IRoomService } from "@/types/IRoomService";
import { dateFormat } from "@/utils/dateFormat";
import { ColumnsType } from "antd/es/table";

type Props = {
  //
  update(service: IRoomService, payload: any): void;
};

export function roomServices({ update }: Props): ColumnsType<IRoomService> {
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
      title: "Phân loại",
      dataIndex: "category",
      width: 200,
      sorter: (a, b) =>
        a.category?.display_name?.localeCompare(
          b.category?.display_name || "",
        ) || 0,
      render(value: IRoomService["category"], record) {
        const display = value ? value.display_name : "Chưa phân loại";

        return (
          <SelectServiceCategory
            value={display}
            bordered={false}
            onChange={(e) => {
              update(record, { category: { title: e } });
            }}
          />
        );
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
