/**
 * Query keys for the dashboard module.
 *
 * Mirrors the structure of `reportKeys`: a stable `all` root plus factory
 * functions for each dashboard aggregate. Dashboard data is read-only so the
 * keys are scoped purely for caching, never for invalidation-by-mutation.
 */

export const dashboardKeys = {
  all: ["dashboard"] as const,

  summary: () =>
    [...dashboardKeys.all, "summary"] as const,

  inventorySummary: () =>
    [...dashboardKeys.all, "inventory-summary"] as const,

  recentActivity: () =>
    [...dashboardKeys.all, "recent-activity"] as const,
};
