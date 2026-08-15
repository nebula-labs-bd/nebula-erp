export const paymentKeys = {
  all: ["payments"] as const,

  payments: () => [...paymentKeys.all, "payments"] as const,
  payment: (id: string) => [...paymentKeys.payments(), id] as const,

  allocations: (paymentId: string) =>
    [...paymentKeys.all, "allocations", paymentId] as const,

  payables: () => [...paymentKeys.all, "payables"] as const,

  receivables: () => [...paymentKeys.all, "receivables"] as const,
};