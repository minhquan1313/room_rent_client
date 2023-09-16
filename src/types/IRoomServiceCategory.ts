export type TRoomServiceCategory = "tn" | "mt";
export interface IRoomServiceCategory {
  _id: string;

  title: TRoomServiceCategory;
  display_name: string | null;

  updatedAt: Date;
  createdAt: Date;
}
