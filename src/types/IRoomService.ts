export type TRoomService = "wifi" | "mt" | "center" | "hood" | "security" | "parking";
export interface IRoomService {
  _id: string;

  title: string;
  display_name: string | null;

  updatedAt: Date;
  createdAt: Date;
}
