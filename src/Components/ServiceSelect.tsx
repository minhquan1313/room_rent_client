import NotFoundContent from "@/Components/NotFoundContent";
import { GlobalDataContext } from "@/Contexts/GlobalDataProvider";
import { searchFilterTextHasLabel } from "@/utils/searchFilterTextHasLabel";
import { Select, SelectProps } from "antd";
import { memo, useContext } from "react";

interface Props extends SelectProps {
  value?: string[];
  onChange?: (value: string[]) => void;
}

const ServiceSelect = memo(({ value, onChange, ...rest }: Props) => {
  const { roomServicesConverted } = useContext(GlobalDataContext);

  return (
    <Select
      filterOption={searchFilterTextHasLabel}
      notFoundContent={<NotFoundContent />}
      mode="multiple"
      onChange={onChange}
      value={value}
      // showSearch={false}
      // virtual={false}
      placeholder="Dịch vụ phòng"
      {...rest}
    >
      {
        roomServicesConverted &&
          roomServicesConverted.map(({ category, services }) => (
            <Select.OptGroup
              label={
                category === "unknown"
                  ? "Chưa phân loại"
                  : category.display_name ?? category.title
              }
              key={category === "unknown" ? -1 : category.title}
            >
              {services.map(({ display_name, title }) => (
                <Select.Option value={title} key={title} label={display_name}>
                  {display_name}
                </Select.Option>
              ))}
            </Select.OptGroup>
          ))
        // roomServices.map(({ display_name, title }) => (
        //   <Select.Option key={title} value={title}>
        //     {display_name}
        //   </Select.Option>
        // ))
      }
    </Select>
  );
});

export default ServiceSelect;
