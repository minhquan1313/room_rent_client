export type TRoomServiceCategory = "tn" | "mt";
export interface IRoomServiceCategory {
  _id: string;

  title: TRoomServiceCategory;
  display_name: string | null;

  updatedAt: string;
  createdAt: string;
}
