/**
 * Company & Branch — core enterprise entities.
 *
 * These contracts are the shared source of truth for multi-company,
 * multi-branch organisations. Every module that needs company/branch
 * context MUST reference these types (via `core`) instead of defining
 * its own copy.
 */

import type { RecordStatus } from "../constants/status";

export interface Company {
  id: string;
  name: string;
  legalName: string;
  logo?: string;
  email?: string;
  phone?: string;
  address?: string;
  taxNumber?: string;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Branch {
  id: string;
  companyId: string;
  name: string;
  code: string;
  address?: string;
  phone?: string;
  /**
   * References the Employee who manages this branch. Resolved from the
   * shared employee registry — never stored as a duplicated record.
   */
  managerId?: string;
  status: RecordStatus;
}
