/**
 * Centralised ERP status enums.
 *
 * Every module imports these instead of defining its own `"active" |
 * "inactive"` literals. Keeping them here guarantees one canonical
 * vocabulary for records and documents across the whole application.
 */

/** Lifecycle state for master-data records (company, user, product…). */
export type RecordStatus = "active" | "inactive" | "archived";

/** Workflow state for transactional documents (sales, purchase, service). */
export type DocumentStatus =
  | "draft"
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

/** Convenience: labels for UI rendering. */
export const RECORD_STATUS_LABELS: Record<RecordStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  archived: "Archived",
};

export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
  draft: "Draft",
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};
