/**
 * Contact — the single shared customer/vendor/business registry.
 *
 * CRITICAL ARCHITECTURE RULE: no module (POS, Sales, Service Desk, CRM…)
 * may create its own duplicate customer/vendor. Every module references
 * a `Contact` by id. POS, Sales, Service Desk and CRM all point at the
 * same record through this entity.
 */

import type { RecordStatus } from "../constants/status";

export type ContactType = "customer" | "vendor" | "business";

export interface BaseContact {
  id: string;
  type: ContactType;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  companyName?: string;
  taxNumber?: string;
  notes?: string;
  createdAt: string;
  status: RecordStatus;
}

export interface CustomerContact extends BaseContact {
  type: "customer";
  customerCode: string;
  creditLimit?: number;
  balance?: number;
}

export interface VendorContact extends BaseContact {
  type: "vendor";
  vendorCode: string;
  payableBalance?: number;
}

export interface BusinessContact extends BaseContact {
  type: "business";
  businessName: string;
  industry?: string;
  contactPerson?: string;
}

export type Contact = CustomerContact | VendorContact | BusinessContact;
