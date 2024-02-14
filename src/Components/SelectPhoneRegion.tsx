import NotFoundContent from "@/Components/NotFoundContent";
import { telCodes } from "@/constants/telCodes";
import { Select, SelectProps } from "antd";
import { memo } from "react";
import { useTranslation } from "react-i18next";

interface Props extends SelectProps {
  // value?: string[];
  // onChange?: (value: string[]) => void;
}

const SelectPhoneRegion = memo(({ ...rest }: Props) => {
  const { t } = useTranslation();

  return (
    <Select
      notFoundContent={<NotFoundContent />}
      placeholder={t("User.Region code")}
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
