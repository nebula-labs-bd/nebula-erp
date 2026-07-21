export const inventoryKeys = {
  all: ["inventory"] as const,

  products: () => [
    ...inventoryKeys.all,
    "products",
  ] as const,

  summary: () => [
    ...inventoryKeys.all,
    "summary",
  ] as const,
};