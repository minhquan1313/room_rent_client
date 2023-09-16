import { TRole } from "@/types/IRole";

export const TOP_ADMIN_ROLES: (TRole | undefined)[] = ["admin"];
export const ADMIN_ROLES: (TRole | undefined)[] = [
  ...TOP_ADMIN_ROLES,
  "admin_lvl_2",
];
export const OWNER_ROLES: (TRole | undefined)[] = [...ADMIN_ROLES, "owner"];
export const USER_ROLES: (TRole | undefined)[] = [...OWNER_ROLES, "user"];

export function isRoleTopAdmin(role?: any) {
  return TOP_ADMIN_ROLES.includes(role);
}
export function isRoleAdmin(role?: any) {
  return ADMIN_ROLES.includes(role);
}
export function isRoleOwner(role?: any) {
  return OWNER_ROLES.includes(role);
}
export function isRoleUser(role?: any) {
  return USER_ROLES.includes(role);
}
