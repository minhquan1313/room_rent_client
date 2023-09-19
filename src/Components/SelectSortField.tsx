import NotFoundContent from "@/Components/NotFoundContent";
import { IRoom } from "@/types/IRoom";
import { FallOutlined, RiseOutlined } from "@ant-design/icons";
import { Select, SelectProps } from "antd";
import { memo } from "react";

const fields: {
  title: `${keyof IRoom}#${1 | -1}`;
  display_name: string | JSX.Element;
}[] = [
  //
  {
    title: "price_per_month#1",
    display_name: (
      <>
        Giá thuê <RiseOutlined />
      </>
    ),
  },
  {
    title: "price_per_month#-1",
    display_name: (
      <>
        Giá thuê <FallOutlined />
      </>
    ),
  },
  {
    title: "createdAt#1",
    display_name: (
      <>
        Ngày đăng <RiseOutlined />
      </>
    ),
  },
  {
    title: "createdAt#-1",
    display_name: (
      <>
        Ngày đăng <FallOutlined />
      </>
    ),
  },
  {
    title: "usable_area#1",
    display_name: (
      <>
        Diện tích sử dụng <RiseOutlined />
      </>
    ),
  },
  {
    title: "usable_area#-1",
    display_name: (
      <>
        Diện tích sử dụng <FallOutlined />
      </>
    ),
  },
];
const SelectSortField = memo((rest: SelectProps) => {
  return (
    <Select
      notFoundContent={<NotFoundContent />}
      placeholder="Sắp xếp theo"
      {...rest}
    >
      {fields.map(({ display_name, title }) => (
        <Select.Option value={title} key={title}>
          {display_name}
        </Select.Option>
      ))}
    </Select>
  );
});

export default SelectSortField;
