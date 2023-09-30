import { TRole } from "@/types/IRole";

export const TOP_ADMIN_ROLES: (TRole | undefined)[] = ["admin"];
export const ADMIN_ROLES: (TRole | undefined)[] = [
  ...TOP_ADMIN_ROLES,
  "admin_lvl_2",
];
export const OWNER_ROLES: (TRole | undefined)[] = [...ADMIN_ROLES, "owner"];
export const USER_ROLES: (TRole | undefined)[] = [...OWNER_ROLES, "user"];

export const USER_ROLES_REVERSE = [...USER_ROLES].reverse();

export function isRoleTopAdmin(role?: string) {
  return TOP_ADMIN_ROLES.includes(role as TRole);
}
export function isRoleAdmin(role?: string) {
  return ADMIN_ROLES.includes(role as TRole);
}
export function isRoleOwner(role?: string) {
  return OWNER_ROLES.includes(role as TRole);
}
export function isRoleUser(role?: string) {
  return USER_ROLES.includes(role as TRole);
}

export function roleOrder(role?: string) {
  return USER_ROLES_REVERSE.indexOf(role as TRole);
}
