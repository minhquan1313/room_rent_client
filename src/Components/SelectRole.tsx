import NotFoundContent from "@/Components/NotFoundContent";
import { GlobalDataContext } from "@/Contexts/GlobalDataProvider";
import { TRole } from "@/types/IRole";
import { Select, SelectProps } from "antd";
import { memo, useContext } from "react";
import { useTranslation } from "react-i18next";

interface Props extends SelectProps {
  disableRoles?: TRole[];
  // value?: string[];
  // onChange?: (value: string[]) => void;
}

const SelectRole = memo(({ disableRoles, ...rest }: Props) => {
  const { t } = useTranslation();
  const { t: tApi } = useTranslation("api");

  const { roles } = useContext(GlobalDataContext);

  const r = !disableRoles
    ? roles
    : roles?.filter((r) => !disableRoles.includes(r.title));

  return (
    <Select
      notFoundContent={<NotFoundContent />}
      placeholder={t("User.Role")}
      {...rest}
    >
      {r &&
        r.map(({ title }) => (
          <Select.Option value={title} key={title}>
            {tApi(`data code.role.${title}`)}
          </Select.Option>
        ))}
    </Select>
  );
});

export default SelectRole;
