import { IUser } from "./IUser";

export interface IEmail {
  _id: string;

  user: IUser;
  email: string;
  verified: boolean;

  updatedAt: string;
  createdAt: string;
}
