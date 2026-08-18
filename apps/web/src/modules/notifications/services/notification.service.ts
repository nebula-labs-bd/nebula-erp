import { apiClient } from "../../../api/client";

import type { Notification } from "../types/notification.types";

/**
 * Notifications service.
 *
 * - `getNotifications` — READ-ONLY fetch.
 * - `markNotificationRead` — benign read-state toggle that patches a
 *   client-side flag. It does not create, update, or delete any underlying
 *   ERP record (sales, payments, inventory, accounting, etc.).
 */
export function getNotifications() {
  return apiClient.get<Notification[]>("/notifications");
}

/** Mark a single notification as read. */
export function markNotificationRead(id: string) {
  return apiClient.post<Notification>(`/notifications/${id}/read`, {});
}
