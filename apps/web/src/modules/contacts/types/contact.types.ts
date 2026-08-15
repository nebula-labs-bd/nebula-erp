export type ContactRole = "customer" | "supplier";

export type ContactStatus = "active" | "inactive";

export interface Contact {
  id: string;
  name: string;
  companyName?: string;
  phone?: string;
  email?: string;
  address?: string;
  taxNumber?: string;
  roles: ContactRole[];
  status: ContactStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactInput {
  name: string;
  companyName?: string;
  phone?: string;
  email?: string;
  address?: string;
  taxNumber?: string;
  roles: ContactRole[];
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