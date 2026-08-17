import { apiClient } from "../../../api/client";

import type {
  ActivityItem,
  DashboardSummary,
  InventorySummary,
} from "../types/dashboard.types";

/**
 * Dashboard service — aggregates existing ERP data into a command-center view.
 *
 * READ-ONLY by design. Every function issues a GET request against the
 * dashboard API and never creates or mutates any underlying record
 * (inventory, stock, products, payments, accounting, etc.).
 */

export function getDashboardSummary() {
  return apiClient.get<DashboardSummary>(
    "/dashboard/summary",
  );
}

export function getInventorySummary() {
  return apiClient.get<InventorySummary>(
    "/dashboard/inventory-summary",
  );
}

export function getRecentActivity() {
  return apiClient.get<ActivityItem[]>(
    "/dashboard/recent-activity",
  );
}
