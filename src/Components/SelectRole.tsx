import NotFoundContent from "@/Components/NotFoundContent";
import { GlobalDataContext } from "@/Contexts/GlobalDataProvider";
import { TRole } from "@/types/IRole";
import { Select, SelectProps } from "antd";
import { memo, useContext } from "react";

interface Props extends SelectProps {
  disableRoles?: TRole[];
  // value?: string[];
  // onChange?: (value: string[]) => void;
}

const SelectRole = memo(({ disableRoles, ...rest }: Props) => {
  const { roles } = useContext(GlobalDataContext);

  const r = !disableRoles
    ? roles
    : roles?.filter((r) => !disableRoles.includes(r.title));

  return (
    <Select
      notFoundContent={<NotFoundContent />}
      placeholder="Giới tính"
      {...rest}
    >
      {r &&
        r.map(({ display_name, title }) => (
          <Select.Option value={title} key={title}>
            {display_name}
          </Select.Option>
        ))}
    </Select>
  );
});

export default SelectRole;
