import { IRoomImage } from "./IRoomImage";
import { IRoomLocation } from "./IRoomLocation";
import { IRoomService, TRoomService } from "./IRoomService";
import { IRoomType, TRoomType } from "./IRoomType";
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
  price_currency_code: string;

  usable_area: number | null;
  usable_area_unit: string | null;

  number_of_living_room: number | null;
  number_of_bedroom: number | null;
  number_of_bathroom: number | null;
  number_of_floor: number;

  available: boolean;

  updatedAt: Date;
  createdAt: Date;
}

export type RoomPayload = {
  owner?: string;
  room_type: TRoomType;
  name: string;

  services?: TRoomService[];

  // id of services
  images?: string[];
  imagesOrders?: number[];
  files?: File[];

  location: RoomLocationPayload;

  sub_name?: string;
  description?: string;

  price_per_month: number;
  price_currency_code: string;

  usable_area?: number;
  usable_area_unit?: string;

  number_of_living_room?: number;
  number_of_bedroom?: number;
  number_of_bathroom?: number;
  number_of_floor?: number;

  available?: boolean;
};

export type RoomLocationPayload = Omit<
  IRoomLocation,
  "_id" | "room" | "updatedAt" | "createdAt"
>;
