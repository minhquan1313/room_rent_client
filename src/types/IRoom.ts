import { IRoomImage } from "./IRoomImage";
import { IRoomLocation } from "./IRoomLocation";
import { IRoomService } from "./IRoomService";
import { IRoomType } from "./IRoomType";
import { IUser } from "./IUser";

export interface IRoom {
  _id: string;

  owner: IUser;
  room_type: IRoomType;
  location: IRoomLocation | null;
  images: IRoomImage[];
  services: IRoomService[];

  name: string;
  sub_name: string | null;
  description: string | null;
  price_per_month: number;
  usable_area: number | null;
  number_of_room: number | null;
  number_of_bedroom: number | null;
  number_of_bathroom: number | null;
  number_of_floor: number;

  updatedAt: Date;
  createdAt: Date;
}
