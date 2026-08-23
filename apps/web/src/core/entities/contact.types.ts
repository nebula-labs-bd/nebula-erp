/**
 * Contact — the single shared customer/vendor/business registry.
 *
 * CRITICAL ARCHITECTURE RULE: no module (POS, Sales, Service Desk, CRM…)
 * may create its own duplicate customer/vendor. Every module references
 * a `Contact` by id. POS, Sales, Service Desk and CRM all point at the
 * same record through this entity.
 */

import type { RecordStatus } from "../constants/status";

/**
 * What a contact *is*. Orthogonal to behaviour — a contact can be an
 * individual person or an organization, and either may hold many `roles`.
 */
export type ContactType = "individual" | "organization";

/**
 * What a contact *does* for the business. Multi-valued: a single contact
 * (e.g. an organization) can be both a customer and a vendor at once.
 */
export type ContactRole = "customer" | "vendor" | "partner" | "other";

/**
 * How two contacts relate to one another (ownership, employment,
 * directorship, partnership, day-to-day contact).
 */
export type ContactRelationshipType =
  | "owner"
  | "employee"
  | "director"
  | "contact_person"
  | "partner";

export interface ContactRelationshipLink {
  /** The other party in the relationship. */
  contactId: string;
  /** The nature of the relationship from this contact's perspective. */
  type: ContactRelationshipType;
  /** Optional display label, e.g. "Jane Doe — Operations Manager". */
  label?: string;
}

/**
 * Unified Contact — the single shared registry for every party the business
 * interacts with (customers, vendors, partners, organizations…).
 *
 * `type` describes what the contact is, `roles` describes what it does, and
 * `relationships` captures how contacts relate to one another.
 *
 * CRITICAL ARCHITECTURE RULE: no module (POS, Sales, Service Desk, CRM…)
 * may create its own duplicate customer/vendor. Every module references a
 * `Contact` by id.
 */
export interface BaseContact {
  id: string;
  type: ContactType;
  /** Primary display name (person's name or organization name). */
  name: string;
  roles: ContactRole[];
  /** How this contact relates to other contacts. */
  relationships: ContactRelationshipLink[];
  phone?: string;
  email?: string;
  address?: string;
  companyName?: string;
  taxNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  status: RecordStatus;
}

export type Contact = BaseContact;
