export type TRoomType = "cc" | "nr" | "nt";
export interface IRoomType {
  _id: string;

  title: string;
  display_name: string | null;

  updatedAt: Date;
  createdAt: Date;
}
