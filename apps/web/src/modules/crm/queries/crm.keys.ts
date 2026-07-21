export const crmKeys = {
  all: ["crm"] as const,

  customers: () => [
    ...crmKeys.all,
    "customers",
  ] as const,

  overview: () => [
    ...crmKeys.all,
    "overview",
  ] as const,
};