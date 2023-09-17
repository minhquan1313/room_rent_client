import NotFoundContent from "@/Components/NotFoundContent";
import { currencyCodes } from "@/constants/currencyCodes";
import { Select, SelectProps } from "antd";
import { memo } from "react";

interface Props extends SelectProps {
  value?: string[];
  onChange?: (value: string[]) => void;
}

const SelectCurrency = memo(({ value, onChange, ...rest }: Props) => {
  return (
    <Select
      notFoundContent={<NotFoundContent />}
      onChange={onChange}
      value={value}
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
