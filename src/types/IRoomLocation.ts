import { IRoom } from "./IRoom";

export interface IRoomLocation {
  _id: string;

  room: IRoom;
  lat: number;
  long: number;
  province: string;
  province_code: number;
  district: string;
  district_code: number;
  ward: string;
  ward_code: number;
  detail_location: string;

  updatedAt: Date;
  createdAt: Date;
}
