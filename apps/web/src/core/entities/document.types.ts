/**
 * Business Document foundation.
 *
 * A single `BaseDocument` is extended by Sales, Purchase and Service
 * documents. Every transactional document in the ERP shares this spine
 * (number, date, status, author) so workflows, search and accounting
 * integrations can treat them uniformly.
 */

import type { DocumentStatus } from "../constants/status";

export interface BaseDocument {
  id: string;
  documentNumber: string;
  date: string;
  status: DocumentStatus;
  createdBy: string;
  createdAt: string;
}

export interface SalesDocument extends BaseDocument {
  customerId: string;
  total: number;
}

export interface PurchaseDocument extends BaseDocument {
  vendorId: string;
  total: number;
}

export interface ServiceDocument extends BaseDocument {
  /** Existing contact (customer/business) id — no duplication. */
  customerId?: string;
  businessId?: string;
  assignedEmployeeId?: string;
  total?: number;
}

export type BusinessDocument =
  | SalesDocument
  | PurchaseDocument
  | ServiceDocument;
