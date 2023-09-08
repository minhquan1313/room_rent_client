import { TRole } from "@/types/IRole";

export const TOP_ADMIN_ROLES: (TRole | undefined)[] = ["admin"];

export const ADMIN_ROLES: (TRole | undefined)[] = [
  ...TOP_ADMIN_ROLES,
  "admin_lvl_2",
];

export const OWNER_ROLES: (TRole | undefined)[] = [...ADMIN_ROLES, "owner"];
