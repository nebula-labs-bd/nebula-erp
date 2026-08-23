/**
 * Customer Mapper — transforms core Contact entities to module-specific shapes.
 *
 * Provides consistent mapping for modules that need customer data in
 * specific formats without duplicating the core entity.
 */

import type { Contact, ContactRole } from "core";

import type { ContactReference } from "./customer.registry";

/** POS-specific contact shape (minimal for checkout). */
export interface POSCustomer {
  id: string;
  name: string;
  customerId: string;
  email?: string;
  phone?: string;
}

/** Sales-specific contact shape (extended for orders). */
export interface SalesCustomer {
  id: string;
  name: string;
  roles: ContactRole[];
  email?: string;
  phone?: string;
  address?: string;
  companyName?: string;
  taxNumber?: string;
}

/** Service Desk contact reference (lightweight). */
export interface ServiceContactRef {
  contactId: string;
  name: string;
}

/** CRM contact shape (full). */
export interface CRMContact {
  id: string;
  type: Contact["type"];
  name: string;
  roles: ContactRole[];
  email?: string;
  phone?: string;
  address?: string;
  companyName?: string;
  taxNumber?: string;
  notes?: string;
  status: Contact["status"];
  createdAt: string;
  updatedAt: string;
}

/** Finance contact shape (for AR/AP). */
export interface FinanceCustomer {
  id: string;
  name: string;
  roles: ContactRole[];
  status: Contact["status"];
}

/** Map core Contact to POS shape. */
export function toPOSCustomer(contact: Contact): POSCustomer {
  return {
    id: contact.id,
    name: contact.name,
    customerId: contact.id,
    email: contact.email,
    phone: contact.phone,
  };
}

/** Map core Contact to Sales shape. */
export function toSalesCustomer(contact: Contact): SalesCustomer {
  return {
    id: contact.id,
    name: contact.name,
    roles: contact.roles,
    email: contact.email,
    phone: contact.phone,
    address: contact.address,
    companyName: contact.companyName,
    taxNumber: contact.taxNumber,
  };
}

/** Map core Contact to Service Desk reference. */
export function toServiceContactRef(contact: Contact): ServiceContactRef {
  return {
    contactId: contact.id,
    name: contact.name,
  };
}

/** Map core Contact to CRM shape. */
export function toCRMContact(contact: Contact): CRMContact {
  return {
    id: contact.id,
    type: contact.type,
    name: contact.name,
    roles: contact.roles,
    email: contact.email,
    phone: contact.phone,
    address: contact.address,
    companyName: contact.companyName,
    taxNumber: contact.taxNumber,
    notes: contact.notes,
    status: contact.status,
    createdAt: contact.createdAt,
    updatedAt: contact.updatedAt,
  };
}

/** Map core Contact to Finance shape. */
export function toFinanceCustomer(contact: Contact): FinanceCustomer {
  return {
    id: contact.id,
    name: contact.name,
    roles: contact.roles,
    status: contact.status,
  };
}

/** Generic mapper for any contact-like reference. */
export function mapContactReference(contact: Contact): ContactReference {
  return {
    contactId: contact.id,
    name: contact.name,
  };
}

/** Check if a Contact holds a given role. */
export function hasContactRole(
  contact: Contact,
  role: ContactRole,
): boolean {
  return contact.roles.includes(role);
}