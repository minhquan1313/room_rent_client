import { IUser } from "@/types/IUser";

export const userNameDisplay = (u: IUser) => {
  return `${u.last_name ?? ""} ${u.first_name}`;
};
