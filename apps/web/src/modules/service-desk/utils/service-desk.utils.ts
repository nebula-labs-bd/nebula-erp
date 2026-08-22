import type {
  ServicePriority,
  ServiceRequestStatus,
} from "../types/service-desk.types";

/** Human-readable labels for service request statuses. */
export const STATUS_LABELS: Record<ServiceRequestStatus, string> = {
  new: "New",
  assigned: "Assigned",
  scheduled: "Scheduled",
  in_progress: "In Progress",
  waiting_customer: "Waiting on Customer",
  completed: "Completed",
  cancelled: "Cancelled",
};

/** Human-readable labels for service priorities. */
export const PRIORITY_LABELS: Record<ServicePriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

/** Tailwind/token-driven chip classes for each status. */
export function statusChipClass(status: ServiceRequestStatus): string {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";

  switch (status) {
    case "new":
      return `${base} bg-[var(--nebula-info)]/10 text-[var(--nebula-info)]`;
    case "assigned":
      return `${base} bg-[var(--nebula-primary)]/10 text-[var(--nebula-primary)]`;
    case "scheduled":
      return `${base} bg-[var(--nebula-text-secondary)]/10 text-[var(--nebula-text-secondary)]`;
    case "in_progress":
      return `${base} bg-[var(--nebula-warning)]/10 text-[var(--nebula-warning)]`;
    case "waiting_customer":
      return `${base} bg-[var(--nebula-purple)]/10 text-[var(--nebula-purple)]`;
    case "completed":
      return `${base} bg-[var(--nebula-success)]/10 text-[var(--nebula-success)]`;
    case "cancelled":
      return `${base} bg-[var(--nebula-danger)]/10 text-[var(--nebula-danger)]`;
    default:
      return `${base} bg-[var(--nebula-surface-muted)] text-[var(--nebula-text-muted)]`;
  }
}

/** Tailwind/token-driven chip classes for each priority. */
export function priorityChipClass(priority: ServicePriority): string {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";

  switch (priority) {
    case "low":
      return `${base} bg-[var(--nebula-success)]/10 text-[var(--nebula-success)]`;
    case "medium":
      return `${base} bg-[var(--nebula-info)]/10 text-[var(--nebula-info)]`;
    case "high":
      return `${base} bg-[var(--nebula-warning)]/10 text-[var(--nebula-warning)]`;
    case "critical":
      return `${base} bg-[var(--nebula-danger)]/10 text-[var(--nebula-danger)]`;
    default:
      return `${base} bg-[var(--nebula-surface-muted)] text-[var(--nebula-text-muted)]`;
  }
}

/** Format an ISO timestamp for compact display. */
export function formatDate(iso?: string): string {
  if (!iso) {
    return "—";
  }

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
