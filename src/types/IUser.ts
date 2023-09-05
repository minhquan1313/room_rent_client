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
  gender: IGender;
  role: IRole;
  phone: IPhoneNumber | null;
  email: IEmail | null;

  updatedAt: Date;
  createdAt: Date;

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

  image?: string;
  last_name?: string;

  role?: TRole;

  owner_banner?: string;
  email?: string;
};
