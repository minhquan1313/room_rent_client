import { IUser } from "./IUser";

export interface IPhoneNumber {
  _id: string;

  user: IUser;
  region_code: string;
  country_code: number;
  national_number: number;
  e164_format: string;
  verified: boolean;

  updatedAt: Date;
  createdAt: Date;
}
