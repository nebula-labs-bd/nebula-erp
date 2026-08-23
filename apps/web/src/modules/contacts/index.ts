/* Contacts module — public surface.

The global Contact Registry is the single source of truth for every party
(customers, vendors, partners, organizations…). Other modules link to contacts
by id and never duplicate them.
*/
export { default as ContactsPage } from "./pages/ContactsPage";
export { default as ContactSelector } from "./components/ContactSelector";
export { default as ContactForm } from "./components/ContactForm";
export { default as ContactTable } from "./components/ContactTable";
export { default as ContactBalance } from "./components/ContactBalance";
export { default as ContactLedgerTable } from "./components/ContactLedgerTable";

export {
  useContacts,
  useContactMutation,
  useContactLedger,
} from "./hooks/useContacts";

export { contactKeys } from "./queries/contact.keys";

export {
  getContacts,
  getContactLedger,
  createContact,
  updateContact,
  deleteContact,
} from "./services/contact.service";

export type {
  Contact,
  ContactRole,
  ContactStatus,
  ContactType,
  ContactRelationshipLink,
  CreateContactInput,
  UpdateContactInput,
  ContactLedgerEntry,
  LedgerReferenceType,
} from "./types/contact.types";
