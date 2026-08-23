import type {
  Contact,
  ContactRole,
  ContactType,
  ContactRelationshipLink,
} from "core";

/**
 * The shared Contact registry is the single source of truth for every party
 * (customers, vendors, partners, organizations…). Re-export the core shape so
 * consumers can import from the contacts module without reaching into `core`
 * directly.
 */
export type {
  Contact,
  ContactRole,
  ContactType,
  ContactRelationshipLink,
};

/** Contacts module status — a focused subset of `RecordStatus` from core. */
export type ContactStatus = "active" | "inactive";

/** Payload for creating a contact through the contacts service. */
export interface CreateContactInput {
  type: ContactType;
  name: string;
  roles: ContactRole[];
  relationships?: ContactRelationshipLink[];
  companyName?: string;
  phone?: string;
  email?: string;
  address?: string;
  taxNumber?: string;
  notes?: string;
  status: ContactStatus;
}

export interface UpdateContactInput extends Partial<CreateContactInput> {
  id: string;
}

/* ---------------------------------------------------------------- */
/* Contact Ledger Foundation                                        */
/* ---------------------------------------------------------------- */

export type LedgerReferenceType = "purchase" | "sale" | "payment" | "adjustment";

export interface ContactLedgerEntry {
  id: string;
  contactId: string;
  date: string;
  referenceType: LedgerReferenceType;
  referenceId: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
}