/**
 * Customer Registry — single access point for customer data across modules.
 *
 * Any module needing customers (CRM, POS, Sales, Service Desk, Finance)
 * uses this registry. It references core Contact entities only —
 * it does NOT create or duplicate customer data.
 */

import { apiClient } from "../../api/client";
import type { Contact, ContactRole } from "core";

/**
 * Lightweight search result shape for contact selectors. `type`/`roles`
 * let callers filter (e.g. a request requester vs. a billing party) without
 * loading the full contact record.
 */
export interface ContactSearchResult {
  id: string;
  type: Contact["type"];
  name: string;
  roles: ContactRole[];
  companyName?: string;
  email?: string;
  phone?: string;
}

/**
 * Fetch a single contact by ID from the shared Contact registry.
 * Returns the unified core Contact entity.
 */
export async function getContact(id: string): Promise<Contact | null> {
  const response = await apiClient.get<Contact>(`/contacts/${id}`);
  return response.data ?? null;
}

/**
 * Search contacts by query string.
 * Returns lightweight results for dropdowns / selectors. No module-specific
 * duplication — every consumer resolves the same shared contact.
 */
export async function searchContacts(query: string): Promise<ContactSearchResult[]> {
  const response = await apiClient.get<Contact[]>(
    `/contacts?q=${encodeURIComponent(query)}`
  );

  return (response.data ?? []).map((contact): ContactSearchResult => ({
    id: contact.id,
    type: contact.type,
    name: contact.name,
    roles: contact.roles,
    companyName: contact.companyName,
    email: contact.email,
    phone: contact.phone,
  }));
}

/**
 * Create a lightweight contact reference for cross-module linking.
 * Used by POS, Sales, Service Desk to reference a contact without embedding
 * the full record.
 */
export interface ContactReference {
  contactId: string;
  name: string;
}

export function createContactReference(contact: Contact): ContactReference {
  return {
    contactId: contact.id,
    name: contact.name,
  };
}

/**
 * Map a core Contact to a generic module shape.
 * Modules can extend this for their specific needs.
 */
export interface ModuleContact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status: Contact["status"];
}

export function mapContactToModule(contact: Contact): ModuleContact {
  return {
    id: contact.id,
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
    status: contact.status,
  };
}