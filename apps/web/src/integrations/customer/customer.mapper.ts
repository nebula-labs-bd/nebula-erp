/**
 * Customer Mapper — transforms core Contact entities to module-specific shapes.
 *
 * Provides consistent mapping for modules that need customer data in
 * specific formats without duplicating the core entity.
 */

import type { Contact, CustomerContact, VendorContact, BusinessContact } from "core";
import type { CustomerReference } from "./customer.registry";

/** POS-specific customer shape (minimal for checkout). */
export interface POSCustomer {
  id: string;
  name: string;
  customerCode?: string;
  email?: string;
  phone?: string;
}

/** Sales-specific customer shape (extended for orders). */
export interface SalesCustomer {
  id: string;
  name: string;
  customerCode?: string;
  email?: string;
  phone?: string;
  address?: string;
  companyName?: string;
  taxNumber?: string;
  creditLimit?: number;
  balance?: number;
}

/** Service Desk customer reference (lightweight). */
export interface ServiceCustomerRef {
  customerId: string;
  name: string;
}

/** CRM customer shape (full). */
export interface CRMContact {
  id: string;
  name: string;
  customerCode?: string;
  email?: string;
  phone?: string;
  address?: string;
  companyName?: string;
  taxNumber?: string;
  notes?: string;
  status: "active" | "inactive" | "archived";
  createdAt: string;
}

/** Finance customer shape (for AR/AP). */
export interface FinanceCustomer {
  id: string;
  name: string;
  customerCode?: string;
  balance: number;
  creditLimit?: number;
  status: "active" | "inactive" | "archived";
}

/** Map core Contact to POS shape. */
export function toPOSCustomer(contact: CustomerContact): POSCustomer {
  return {
    id: contact.id,
    name: contact.name,
    customerCode: contact.customerCode,
    email: contact.email,
    phone: contact.phone,
  };
}

/** Map core Contact to Sales shape. */
export function toSalesCustomer(contact: CustomerContact): SalesCustomer {
  return {
    id: contact.id,
    name: contact.name,
    customerCode: contact.customerCode,
    email: contact.email,
    phone: contact.phone,
    address: contact.address,
    companyName: contact.companyName,
    taxNumber: contact.taxNumber,
    creditLimit: contact.creditLimit,
    balance: contact.balance,
  };
}

/** Map core Contact to Service Desk reference. */
export function toServiceCustomerRef(contact: CustomerContact): ServiceCustomerRef {
  return {
    customerId: contact.id,
    name: contact.name,
  };
}

/** Map core Contact to CRM shape. */
export function toCRMContact(contact: Contact): CRMContact {
  return {
    id: contact.id,
    name: contact.name,
    customerCode: contact.type === "customer" ? contact.customerCode : undefined,
    email: contact.email,
    phone: contact.phone,
    address: contact.address,
    companyName: contact.companyName,
    taxNumber: contact.taxNumber,
    notes: contact.notes,
    status: contact.status,
    createdAt: contact.createdAt,
  };
}

/** Map core Contact to Finance shape. */
export function toFinanceCustomer(contact: CustomerContact): FinanceCustomer {
  return {
    id: contact.id,
    name: contact.name,
    customerCode: contact.customerCode,
    balance: contact.balance ?? 0,
    creditLimit: contact.creditLimit,
    status: contact.status,
  };
}

/** Generic mapper for any customer-like contact. */
export function mapCustomerReference(contact: CustomerContact): CustomerReference {
  return {
    customerId: contact.id,
    name: contact.name,
    customerCode: contact.customerCode,
  };
}

/** Check if a Contact is a customer. */
export function isCustomer(contact: Contact): contact is CustomerContact {
  return contact.type === "customer";
}

/** Check if a Contact is a vendor. */
export function isVendor(contact: Contact): contact is VendorContact {
  return contact.type === "vendor";
}

/** Check if a Contact is a business. */
export function isBusiness(contact: Contact): contact is BusinessContact {
  return contact.type === "business";
}