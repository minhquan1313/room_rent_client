import { IRoom } from "./IRoom";

export interface IRoomLocation {
  _id: string;

  room: IRoom;
  lat: number;
  long: number;

  country: string;
  province: string;
  district?: string;
  ward?: string;
  detail_location: string;

  updatedAt: Date;
  createdAt: Date;
}
