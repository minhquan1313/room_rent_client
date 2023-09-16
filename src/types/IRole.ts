export type TRole = "admin" | "admin_lvl_2" | "user" | "owner";
export interface IRole {
  _id: string;

  title: TRole;
  display_name: string | null;

  updatedAt: Date;
  createdAt: Date;
}
