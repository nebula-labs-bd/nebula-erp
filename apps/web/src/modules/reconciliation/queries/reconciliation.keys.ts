export const reconciliationKeys = {
  all: ["reconciliation"] as const,

  bankTransactions: () =>
    [...reconciliationKeys.all, "bank-transactions"] as const,
  bankTransaction: (id: string) =>
    [...reconciliationKeys.bankTransactions(), id] as const,

  matches: () => [...reconciliationKeys.all, "matches"] as const,
  match: (id: string) =>
    [...reconciliationKeys.matches(), id] as const,
};
