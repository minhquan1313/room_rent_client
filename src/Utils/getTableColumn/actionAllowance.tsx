import { isRoleTopAdmin, roleOrder } from "@/constants/roleType";
import { IUser } from "@/types/IUser";

export function actionAllowance(
  role?: IUser["role"],
  otherRole?: IUser["role"],
) {
  const disabled =
    isRoleTopAdmin(otherRole?.title) ||
    roleOrder(otherRole?.title) >= roleOrder(role?.title);

  return !disabled;
}
