import NotFoundContent from "@/Components/NotFoundContent";
import { GlobalDataContext } from "@/Contexts/GlobalDataProvider";
import { Select, SelectProps } from "antd";
import { memo, useContext } from "react";

interface Props extends SelectProps {
  // value?: string[];
  // onChange?: (value: string[]) => void;
}

const SelectRole = memo(({ ...rest }: Props) => {
  const { roles } = useContext(GlobalDataContext);

  return (
    <Select
      notFoundContent={<NotFoundContent />}
      placeholder="Giới tính"
      {...rest}
    >
      {roles &&
        roles.map(({ display_name, title }) => (
          <Select.Option value={title} key={title}>
            {display_name}
          </Select.Option>
        ))}
    </Select>
  );
});

export default SelectRole;
