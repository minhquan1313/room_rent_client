import { ISaved } from "@/types/ISaved";
import { IRoomImage } from "./IRoomImage";
import { IRoomLocation } from "./IRoomLocation";
import { IRoomService, TRoomService } from "./IRoomService";
import { IRoomType, TRoomType } from "./IRoomType";

export interface IRoom {
  _id: string;

  owner: string;
  room_type: IRoomType | null;
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

  is_visible: boolean;
  disabled: boolean;
  verified_real: boolean;
  verified: boolean;

  updatedAt: string;
  createdAt: string;

  saved?: ISaved[];
}

export interface IDataWithCount<T> {
  count: number;
  data: T[];
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
};

export interface RoomLocationPayload
  extends Omit<
    IRoomLocation,
    "_id" | "room" | "updatedAt" | "createdAt" | "lat_long"
  > {
  lat: number;
  long: number;
}

export type TCountData = {
  label: string;
  count: number;
  image?: string;
};

export interface RoomSearchQuery {
  kw?: string;

  services?: string[];
  room_type?: string;
  province?: string;
  district?: string;
  ward?: string;

  limit?: number;
  page?: number;

  usable_area?: number;
  usable_area_from?: number;
  usable_area_to?: number;

  price_per_month_from?: number;
  price_per_month_to?: number;

  number_of_living_room_from?: number;
  number_of_living_room_to?: number;

  number_of_bedroom_from?: number;
  number_of_bedroom_to?: number;

  number_of_bathroom_from?: number;
  number_of_bathroom_to?: number;

  number_of_floor_from?: number;
  number_of_floor_to?: number;

  sort_field?: string;
  sort?: 1 | -1 | string;

  // owner?: string;
  // ...
  // ?services=wifi,mt
  // ?room_type=cc,nr
  // ?kw=adwdawd
  // ?province=ben tre
  // ?district=adad
  // ?ward=adwwd
}
