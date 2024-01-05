import { isRoleTopAdmin, roleOrder } from "@/constants/roleType";
import { IUser } from "@/types/IUser";

export function actionAllowance(
  role?: IUser["role"],
  otherRole?: IUser["role"],
) {
  const allowed =
    isRoleTopAdmin(otherRole?.title) ||
    roleOrder(role?.title) > roleOrder(otherRole?.title);

  return allowed;
}
