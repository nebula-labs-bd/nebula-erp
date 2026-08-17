import { useQuery } from "@tanstack/react-query";

import {
  getDashboardSummary,
  getInventorySummary,
  getRecentActivity,
} from "../services/dashboard.service";

import { dashboardKeys } from "../queries/dashboard.keys";

import type {
  ActivityItem,
  DashboardSummary,
  InventorySummary,
} from "../types/dashboard.types";

/**
 * Dashboard hooks — READ-ONLY data access.
 *
 * The dashboard module never mutates source data, so these hooks only expose
 * `useQuery`. No `useMutation` is provided because there are no dashboard
 * writes; the command center is a pure aggregation/decision surface.
 */

export function useDashboardSummary() {
  return useQuery<DashboardSummary>({
    queryKey: dashboardKeys.summary(),
    queryFn: async () => {
      const response = await getDashboardSummary();
      return response.data;
    },
  });
}

export function useInventorySummary() {
  return useQuery<InventorySummary>({
    queryKey: dashboardKeys.inventorySummary(),
    queryFn: async () => {
      const response = await getInventorySummary();
      return response.data;
    },
  });
}

export function useRecentActivity() {
  return useQuery<ActivityItem[]>({
    queryKey: dashboardKeys.recentActivity(),
    queryFn: async () => {
      const response = await getRecentActivity();
      return response.data;
    },
  });
}
