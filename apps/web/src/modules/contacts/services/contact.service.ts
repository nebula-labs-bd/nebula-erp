import { apiClient } from "../../../api/client";

import type {
  Contact,
  CreateContactInput,
  UpdateContactInput,
  ContactLedgerEntry,
} from "../types/contact.types";

/* ---------------------------------------------------------------- */
/* Contacts                                                          */
/* ---------------------------------------------------------------- */

export function getContacts() {
  return apiClient.get<Contact[]>("/contacts/contacts");
}

export function createContact(data: CreateContactInput) {
  return apiClient.post<Contact>("/contacts/contacts", data);
}

export function updateContact(data: UpdateContactInput) {
  return apiClient.post<Contact>(`/contacts/contacts/${data.id}`, data);
}

export function deleteContact(id: string) {
  return apiClient.post(`/contacts/contacts/${id}/delete`, {});
}

/* ---------------------------------------------------------------- */
/* Contact Ledger                                                    */
/* ---------------------------------------------------------------- */

export function getContactLedger(contactId: string) {
  return apiClient.get<ContactLedgerEntry[]>(
    `/contacts/contacts/${contactId}/ledger`,
  );
}