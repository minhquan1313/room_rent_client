import { IRoom } from "./IRoom";

export interface IRoomImage {
  _id: string;

  room: IRoom;
  image: string;
  order: number | null;

  updatedAt: string;
  createdAt: string;
}
