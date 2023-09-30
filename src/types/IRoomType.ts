export type TRoomType = "cc" | "nr" | "nt" | "ktx" | "ccm" | "ttncc";
export interface IRoomType {
  _id: string;

  title: TRoomType;
  display_name: string | null;

  updatedAt: string;
  createdAt: string;
}
