import { useQuery } from "@tanstack/react-query";

import { getActivities } from "../services/activity.service";
import { activityKeys } from "../queries/activity.keys";

import type { ActivityItem } from "../types/activity.types";

/**
 * Activity Center feed hook — READ-ONLY data access.
 *
 * Loads the cross-module activity feed. The hook only exposes `useQuery`;
 * the activity module never mutates source data.
 */
export function useActivities() {
  return useQuery<ActivityItem[]>({
    queryKey: activityKeys.feed(),
    queryFn: async () => {
      const response = await getActivities();

      return response.data;
    },
  });
}
