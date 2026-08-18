/**
 * Notifications — domain types.
 *
 * A read-only notification feed with a benign read-state toggle
 * (`markNotificationRead`) that updates a client-side flag — no underlying
 * ERP record is mutated.
 */

/* ------------------------------------------------------------------ */
/* Notification Type                                                   */
/* ------------------------------------------------------------------ */

/** Semantic severity of a notification. */
export type NotificationType = "warning" | "info" | "success" | "danger";

/* ------------------------------------------------------------------ */
/* Notification                                                        */
/* ------------------------------------------------------------------ */

export interface Notification {
  /** Stable identifier. */
  id: string;

  /** Severity category (matches {@link NotificationType}). */
  type: NotificationType;

  /** Short headline. */
  title: string;

  /** Longer body text. */
  message: string;

  /** ISO timestamp of when the notification was created. */
  createdAt: string;

  /** Whether the user has acknowledged this notification. */
  read: boolean;

  /** Optional route to drill into the underlying record. */
  url?: string;
}
