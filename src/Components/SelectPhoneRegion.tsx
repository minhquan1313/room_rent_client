import NotFoundContent from "@/Components/NotFoundContent";
import { telCodes } from "@/constants/telCodes";
import { Select, SelectProps } from "antd";
import { memo } from "react";

interface Props extends SelectProps {
  // value?: string[];
  // onChange?: (value: string[]) => void;
}

const SelectPhoneRegion = memo(({ ...rest }: Props) => {
  return (
    <Select
      notFoundContent={<NotFoundContent />}
      placeholder="Mã vùng"
      {...rest}
    >
      {telCodes.map(({ code, label }) => (
        <Select.Option value={code} key={code}>
          +{label}
        </Select.Option>
      ))}
    </Select>
  );
});

export default SelectPhoneRegion;
