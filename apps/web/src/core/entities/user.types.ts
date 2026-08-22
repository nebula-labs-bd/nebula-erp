/**
 * User & Employee — core identity entities.
 *
 * `User` is the login/identity record (auth, role, permissions).
 * `Employee` is the HR extension of a user. A single person is one user
 * with (optionally) one employee profile. Modules that need "who did
 * this" reference `userId` / `employeeId` rather than embedding a copy.
 */

import type { RecordStatus } from "../constants/status";

export type UserRole =
  | "admin"
  | "manager"
  | "employee"
  | "technician"
  | "cashier";

/**
 * Permission keys live in `permissions.ts` (app config). The user record
 * stores the resolved set so the UI can branch on it without recomputing.
 */
export type Permission = string;

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  permissions: Permission[];
  status: RecordStatus;
}

export type EmployeeStatus = RecordStatus;

export interface Employee {
  id: string;
  /** Owning identity record — shared, never duplicated. */
  userId: string;
  employeeCode: string;
  department?: string;
  designation?: string;
  joinDate?: string;
  status: EmployeeStatus;
}
