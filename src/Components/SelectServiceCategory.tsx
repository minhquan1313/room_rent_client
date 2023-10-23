import NotFoundContent from "@/Components/NotFoundContent";
import { GlobalDataContext } from "@/Contexts/GlobalDataProvider";
import { searchFilterTextHasLabel } from "@/utils/searchFilterTextHasLabel";
import { Select, SelectProps } from "antd";
import { memo, useContext } from "react";

interface Props extends SelectProps {}

const SelectServiceCategory = memo(({ ...rest }: Props) => {
  const { roomServiceCategories } = useContext(GlobalDataContext);

  return (
    <Select
      filterOption={searchFilterTextHasLabel}
      notFoundContent={<NotFoundContent />}
      placeholder="Dịch vụ phòng"
      {...rest}
    >
      {roomServiceCategories &&
        roomServiceCategories.map(({ display_name, title }) => (
          <Select.Option value={title} key={title} label={display_name}>
            {display_name}
          </Select.Option>
        ))}
    </Select>
  );
});

export default SelectServiceCategory;
