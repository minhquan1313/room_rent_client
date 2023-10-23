import NotFoundContent from "@/Components/NotFoundContent";
import { currencyCodes } from "@/constants/currencyCodes";
import { Select, SelectProps } from "antd";
import { memo } from "react";

interface Props extends SelectProps {
  room2?: string[];
  onChange?: (value: string[]) => void;
}

const SelectCurrency = memo(({ room2: value, onChange, ...rest }: Props) => {
  return (
    <Select
      notFoundContent={<NotFoundContent />}
      onChange={onChange}
      room2={value}
      placeholder="Đơn vị tiền tệ"
      {...rest}
    >
      {currencyCodes &&
        currencyCodes.map(({ code, label }) => (
          <Select.Option value={code} key={code}>
            {code}({label})
          </Select.Option>
        ))}
    </Select>
  );
});

export default SelectCurrency;
