import { apiClient } from "../../../api/client";

import type { ActivityItem } from "../types/activity.types";

/**
 * Activity Center service — READ-ONLY by design.
 *
 * Issues a GET request against `/activity` and never creates or mutates any
 * underlying ERP record (sales, purchases, inventory, payments, accounting).
 */
export function getActivities() {
  return apiClient.get<ActivityItem[]>("/activity");
}
