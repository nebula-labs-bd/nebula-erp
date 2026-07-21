export const roles = {
  ADMIN: "admin",
  MANAGER: "manager",
  STAFF: "staff",
  VIEWER: "viewer",
} as const;

export type Role =
  (typeof roles)[keyof typeof roles];