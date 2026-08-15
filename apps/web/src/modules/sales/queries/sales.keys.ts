export const salesKeys = {
  all: ["sales"] as const,

  customers: () => [
    ...salesKeys.all,
    "customers",
  ] as const,

  orders: () => [
    ...salesKeys.all,
    "orders",
  ] as const,

  deliveries: () => [
    ...salesKeys.all,
    "deliveries",
  ] as const,
};