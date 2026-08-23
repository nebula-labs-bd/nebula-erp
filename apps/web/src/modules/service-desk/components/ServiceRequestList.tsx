import { Search } from "lucide-react";

import { useMemo, useState } from "react";

import ServiceRequestCard from "./ServiceRequestCard";

import {
  PRIORITY_LABELS,
  STATUS_LABELS,
} from "../utils/service-desk.utils";

import type {
  ServicePriority,
  ServiceRequest,
  ServiceRequestStatus,
} from "../types/service-desk.types";

type ServiceRequestListProps = {
  requests: ServiceRequest[];
  onSelect?: (request: ServiceRequest) => void;
};

const STATUS_OPTIONS: ServiceRequestStatus[] = [
  "new",
  "assigned",
  "scheduled",
  "in_progress",
  "waiting_customer",
  "completed",
  "cancelled",
];

const PRIORITY_OPTIONS: ServicePriority[] = [
  "low",
  "medium",
  "high",
  "critical",
];

/**
 * Filterable list of service requests.
 *
 * Filters by free-text search, status and priority. Each row reuses the
 * requester reference already resolved from the unified Contact Registry.
 */
export default function ServiceRequestList({
  requests,
  onSelect,
}: ServiceRequestListProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ServiceRequestStatus | "all">("all");
  const [priority, setPriority] = useState<ServicePriority | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return requests.filter((request) => {
      if (status !== "all" && request.status !== status) {
        return false;
      }

      if (priority !== "all" && request.priority !== priority) {
        return false;
      }

      if (!q) {
        return true;
      }

      return (
        request.ticketNumber.toLowerCase().includes(q) ||
        request.title.toLowerCase().includes(q) ||
        (request.requester?.name ?? "").toLowerCase().includes(q)
      );
    });
  }, [requests, query, status, priority]);

  const selectClass =
    "rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface)] px-3 py-2 text-sm text-[var(--nebula-text-primary)] transition-colors hover:bg-[var(--nebula-surface-muted)]";

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--nebula-text-muted)]"
          />

          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search ticket #, title or customer…"
            className="w-full rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface)] py-2 pl-9 pr-3 text-sm text-[var(--nebula-text-primary)] outline-none transition-colors placeholder:text-[var(--nebula-text-muted)] focus:border-[var(--nebula-primary)]"
          />
        </div>

        <select
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as ServiceRequestStatus | "all")
          }
          className={selectClass}
          aria-label="Filter by status"
        >
          <option value="all">All statuses</option>

          {STATUS_OPTIONS.map((option) => (
            <option
              key={option}
              value={option}
            >
              {STATUS_LABELS[option]}
            </option>
          ))}
        </select>

        <select
          value={priority}
          onChange={(event) =>
            setPriority(event.target.value as ServicePriority | "all")
          }
          className={selectClass}
          aria-label="Filter by priority"
        >
          <option value="all">All priorities</option>

          {PRIORITY_OPTIONS.map((option) => (
            <option
              key={option}
              value={option}
            >
              {PRIORITY_LABELS[option]}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-[var(--nebula-radius-lg)] border border-dashed border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-10 text-center text-sm text-[var(--nebula-text-muted)]">
          No service requests match your filters.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((request) => (
            <ServiceRequestCard
              key={request.id}
              request={request}
              onClick={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
