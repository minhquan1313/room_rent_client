import NotFoundContent from "@/Components/NotFoundContent";
import { GlobalDataContext } from "@/Contexts/GlobalDataProvider";
import { Select, SelectProps } from "antd";
import { memo, useContext } from "react";

interface Props extends SelectProps {
  value?: string[];
  onChange?: (value: string[]) => void;
}

const RoomTypeSelect = memo(({ value, onChange, ...rest }: Props) => {
  const { roomTypes } = useContext(GlobalDataContext);

  return (
    <Select
      notFoundContent={<NotFoundContent />}
      onChange={onChange}
      value={value}
      placeholder="Kiểu phòng"
      {...rest}
    >
      {roomTypes &&
        roomTypes.map(({ display_name, title }) => (
          <Select.Option value={title} key={title}>
            {display_name}
          </Select.Option>
        ))}
    </Select>
  );
});

export default RoomTypeSelect;
