import { useQuery } from "@tanstack/react-query";

import { getNotifications } from "../services/notification.service";
import { notificationKeys } from "../queries/notification.keys";

import type { Notification } from "../types/notification.types";

/**
 * Notifications feed hook — READ-ONLY data access.
 */
export function useNotifications() {
  return useQuery<Notification[]>({
    queryKey: notificationKeys.list(),
    queryFn: async () => {
      const response = await getNotifications();
      return response.data;
    },
  });
}

/**
 * Derive the unread count from a cached notifications list.
 *
 * This is intentionally a plain helper (not a hook) so callers can use it
 * inside any `useQuery` selector or derived state without adding extra
 * subscriptions.
 */
export function unreadCount(notifications: Notification[] | undefined): number {
  return (notifications ?? []).filter((n) => !n.read).length;
}
