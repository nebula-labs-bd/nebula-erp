export const accountingKeys = {
  all: ["accounting"] as const,

  transactions: () => [
    ...accountingKeys.all,
    "transactions",
  ] as const,

  summary: () => [
    ...accountingKeys.all,
    "summary",
  ] as const,
};