export const accountingKeys = {
  all: ["accounting"] as const,

  accounts: () => [...accountingKeys.all, "accounts"] as const,
  account: (id: string) => [...accountingKeys.accounts(), id] as const,

  journalEntries: () => [...accountingKeys.all, "journal-entries"] as const,
  journalEntry: (id: string) => [...accountingKeys.journalEntries(), id] as const,

  ledger: () => [...accountingKeys.all, "ledger"] as const,
  ledgerByAccount: (accountId: string) => [...accountingKeys.ledger(), accountId] as const,

  summary: () => [...accountingKeys.all, "summary"] as const,
  transactions: () => [...accountingKeys.all, "transactions"] as const,
};