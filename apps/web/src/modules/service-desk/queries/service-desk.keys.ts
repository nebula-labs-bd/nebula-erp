/**
 * React Query keys for the Service Desk module.
 *
 * Foundation only — there is no backend yet. These keys follow the
 * established convention (see dashboard.keys / crm.keys) so the queries can
 * later be backed by `apiClient` without changing call sites.
 */

export const serviceDeskKeys = {
  all: ["service-desk"] as const,
  requests: () => [...serviceDeskKeys.all, "requests"] as const,
  stats: () => [...serviceDeskKeys.all, "stats"] as const,
};
