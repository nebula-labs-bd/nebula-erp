export const taxKeys = {
  all: ["tax"] as const,

  types: () => [...taxKeys.all, "types"] as const,
  type: (id: string) => [...taxKeys.types(), id] as const,

  transactions: () => [...taxKeys.all, "transactions"] as const,
  summary: () => [...taxKeys.all, "summary"] as const,
};
