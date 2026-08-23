import {
  PRIORITY_LABELS,
  STATUS_LABELS,
  formatDate,
  priorityChipClass,
  statusChipClass,
} from "../utils/service-desk.utils";

import type { ServiceRequest } from "../types/service-desk.types";

type ServiceRequestCardProps = {
  request: ServiceRequest;
  onClick?: (request: ServiceRequest) => void;
};

/**
 * Compact list row for a single service request.
 *
 * Uses the shared status/priority chips (token-driven colors) and the
 * requester reference resolved from the unified Contact Registry — the service
 * desk never stores its own copy of the contact.
 */
export default function ServiceRequestCard({
  request,
  onClick,
}: ServiceRequestCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(request)}
      className="flex w-full items-center justify-between gap-4 rounded-[var(--nebula-radius-lg)] border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-4 text-left shadow-[var(--nebula-shadow-sm)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--nebula-shadow-md)]"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-[var(--nebula-text-muted)]">
            {request.ticketNumber}
          </span>

          <span className={statusChipClass(request.status)}>
            {STATUS_LABELS[request.status]}
          </span>

          <span className={priorityChipClass(request.priority)}>
            {PRIORITY_LABELS[request.priority]}
          </span>
        </div>

        <p className="mt-1 truncate text-sm font-semibold text-[var(--nebula-text-primary)]">
          {request.title}
        </p>

        <p className="mt-0.5 truncate text-xs text-[var(--nebula-text-secondary)]">
          {request.requester?.name ?? "Unassigned contact"}
          {" · "}
          {request.assignedEmployee?.name ?? "Unassigned"}
        </p>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-xs text-[var(--nebula-text-muted)]">Scheduled</p>

        <p className="text-sm font-medium text-[var(--nebula-text-primary)]">
          {formatDate(request.scheduledDate)}
        </p>
      </div>
    </button>
  );
}
