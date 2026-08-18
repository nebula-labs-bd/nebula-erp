/**
 * Activity Center — domain types.
 *
 * A read-only feed of cross-module business events (sales, purchases,
 * payments, inventory movements, expenses and accounting entries). The
 * activity module is strictly READ-ONLY: it never creates transactions or
 * mutates inventory, stock, payments, accounting records, or any other
 * source data.
 */

/* ------------------------------------------------------------------ */
/* Activity Type                                                       */
/* ------------------------------------------------------------------ */

/** Every kind of business event surfaced in the Activity Center. */
export type ActivityType =
  | "sale"
  | "purchase"
  | "payment"
  | "inventory"
  | "expense"
  | "accounting";

/* ------------------------------------------------------------------ */
/* Activity Item                                                       */
/* ------------------------------------------------------------------ */

export interface ActivityItem {
  /** Stable identifier of the activity event. */
  id: string;

  /** Kind of event (matches {@link ActivityType}). */
  type: ActivityType;

  /** Human-readable primary label (e.g. invoice number, contact name). */
  title: string;

  /** Secondary context (e.g. amount, status, reference). */
  description: string;

  /** ISO timestamp of when the activity occurred. */
  date: string;

  /** Optional route to drill into the underlying record. */
  url?: string;
}
