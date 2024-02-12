import { IRole } from "@/types/IRole";
import { Badge } from "antd";
import { memo } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  //
  role: IRole;
};
const UserRoleBadge = memo(({ role }: Props) => {
  const { t } = useTranslation("api");

  return (
    <Badge
      color="cyan"
      count={t(`data code.role.${role.title}`)}
      showZero={false}
    />
  );
});

export default UserRoleBadge;
