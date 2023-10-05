import { IEmail } from "./IEmail";
import { IGender, TGender } from "./IGender";
import { IPhoneNumber } from "./IPhoneNumber";
import { IRole, TRole } from "./IRole";

export interface IUser {
  _id: string;

  username: string;
  password: string;
  first_name: string;
  last_name: string | null;
  image: string | null;
  owner_banner: string | null;
  disabled: boolean;
  gender: IGender | null;
  role: IRole | null;
  phone: IPhoneNumber | null;
  email: IEmail | null;

  updatedAt: string;
  createdAt: string;

  token?: string;
}

export type UserLoginPayload = {
  username: string;
  password: string;
};
export type UserRegisterPayload = {
  username: string;
  password: string;
  first_name: string;
  tell: string | number;
  region_code: string;
  disabled?: boolean;

  gender?: TGender;
  role?: TRole;
  email?: string;

  image?: string;
  last_name?: string;
  owner_banner?: string;
};
