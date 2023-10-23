import NotFoundContent from "@/Components/NotFoundContent";
import { measureUnitCodes } from "@/constants/measureUnitCodes";
import { Select, SelectProps } from "antd";
import { memo } from "react";

interface Props extends SelectProps {
  // value?: string[];
  // onChange?: (value: string[]) => void;
}

const SelectMeasure = memo(({ ...rest }: Props) => {
  return (
    <Select
      notFoundContent={<NotFoundContent />}
      placeholder="Kiểu phòng"
      {...rest}
    >
      {measureUnitCodes &&
        measureUnitCodes.map(({ code, label, sup }) => (
          <Select.Option value={code} key={code}>
            {label}
            <sup>{sup}</sup>
          </Select.Option>
        ))}
    </Select>
  );
});

export default SelectMeasure;
