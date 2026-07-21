export const salesKeys = {
  all: ["sales"] as const,

  orders: () => [
    ...salesKeys.all,
    "orders",
  ] as const,

  summary: () => [
    ...salesKeys.all,
    "summary",
  ] as const,
};