export const contactKeys = {
  all: ["contacts"] as const,

  contacts: () => [...contactKeys.all, "contacts"] as const,
  contact: (id: string) => [...contactKeys.contacts(), id] as const,

  ledger: (contactId: string) =>
    [...contactKeys.all, "ledger", contactId] as const,
};