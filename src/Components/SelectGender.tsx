import NotFoundContent from "@/Components/NotFoundContent";
import { GlobalDataContext } from "@/Contexts/GlobalDataProvider";
import { Select, SelectProps } from "antd";
import { memo, useContext } from "react";
import { useTranslation } from "react-i18next";

interface Props extends SelectProps {
  // value?: string[];
  // onChange?: (value: string[]) => void;
}

const SelectGender = memo(({ ...rest }: Props) => {
  const { t } = useTranslation();
  const { t: tApi } = useTranslation("api");

  const { genders } = useContext(GlobalDataContext);

  return (
    <Select
      notFoundContent={<NotFoundContent />}
      placeholder={t("User.Gender")}
      {...rest}
    >
      {genders &&
        genders.map(({ title }) => (
          <Select.Option value={title} key={title}>
            {tApi(`data code.gender.${title}`)}
          </Select.Option>
        ))}
    </Select>
  );
});

export default SelectGender;
