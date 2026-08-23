/**
 * Customer Registry — single access point for customer data across modules.
 *
 * Any module needing customers (CRM, POS, Sales, Service Desk, Finance)
 * uses this registry. It references core Contact entities only —
 * it does NOT create or duplicate customer data.
 */

import { apiClient } from "../../api/client";
import type { Contact, CustomerContact } from "core";

/** Lightweight search result shape for selectors. */
export interface CustomerSearchResult {
  id: string;
  name: string;
  customerCode?: string;
  email?: string;
  phone?: string;
  type: "customer" | "vendor" | "business";
}

/**
 * Fetch a single customer by ID.
 * Returns the core Contact entity (customer variant).
 */
export async function getCustomer(id: string): Promise<CustomerContact | null> {
  const response = await apiClient.get<Contact>(`/contacts/${id}`);

  if (!response.data || response.data.type !== "customer") {
    return null;
  }

  return response.data as CustomerContact;
}

/**
 * Search customers by query string.
 * Returns lightweight results for dropdowns/selectors.
 */
export async function searchCustomers(query: string): Promise<CustomerSearchResult[]> {
  const response = await apiClient.get<Contact[]>(
    `/contacts?type=customer&q=${encodeURIComponent(query)}`
  );

  return (response.data ?? []).map((contact): CustomerSearchResult => ({
    id: contact.id,
    name: contact.name,
    customerCode: contact.type === "customer" ? contact.customerCode : undefined,
    email: contact.email,
    phone: contact.phone,
    type: contact.type,
  }));
}

/**
 * Create a lightweight customer reference for cross-module linking.
 * Used by POS, Sales, Service Desk to reference a customer without embedding full data.
 */
export interface CustomerReference {
  customerId: string;
  name: string;
  customerCode?: string;
}

export function createCustomerReference(contact: CustomerContact): CustomerReference {
  return {
    customerId: contact.id,
    name: contact.name,
    customerCode: contact.customerCode,
  };
}

/**
 * Map a core Contact to a module-specific shape.
 * Modules can extend this for their specific needs.
 */
export interface ModuleCustomer {
  id: string;
  name: string;
  customerCode?: string;
  email?: string;
  phone?: string;
  status: "active" | "inactive" | "archived";
}

export function mapCustomerToModule(contact: CustomerContact): ModuleCustomer {
  return {
    id: contact.id,
    name: contact.name,
    customerCode: contact.customerCode,
    email: contact.email,
    phone: contact.phone,
    status: contact.status,
  };
}