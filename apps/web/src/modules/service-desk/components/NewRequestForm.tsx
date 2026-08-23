import { useMemo, useState } from "react";

import { ChevronDown, UserRound } from "lucide-react";

import { searchCustomers, type CustomerSearchResult } from "integrations/customer";

import {
  PRIORITY_LABELS,
  STATUS_LABELS,
} from "../utils/service-desk.utils";

import type {
  ServicePriority,
  ServiceRequest,
  ServiceRequestStatus,
} from "../types/service-desk.types";

type NewRequestFormProps = {
  /** Called with a fully-formed request (foundation: local state, no API). */
  onSubmit: (request: ServiceRequest) => void;
  onCancel?: () => void;
};

const PRIORITY_OPTIONS: ServicePriority[] = [
  "low",
  "medium",
  "high",
  "critical",
];

const STATUS_OPTIONS: ServiceRequestStatus[] = [
  "new",
  "assigned",
  "scheduled",
  "in_progress",
  "waiting_customer",
  "completed",
  "cancelled",
];

const inputClass =
  "w-full rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface)] px-3 py-2 text-sm text-[var(--nebula-text-primary)] outline-none transition-colors placeholder:text-[var(--nebula-text-muted)] focus:border-[var(--nebula-primary)]";

const labelClass =
  "mb-1.5 block text-sm font-medium text-[var(--nebula-text-secondary)]";

/**
 * New service request form.
 *
 * IMPORTANT (Part 10): the customer selector uses the integration layer
 * `searchCustomers` — the single source of truth for contacts. The service
 * desk NEVER creates a duplicate customer; it only links by `customerId`.
 */
export default function NewRequestForm({
  onSubmit,
  onCancel,
}: NewRequestFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<ServicePriority>("medium");
  const [status, setStatus] = useState<ServiceRequestStatus>("new");
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [customerOpen, setCustomerOpen] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");
  const [searchResults, setSearchResults] = useState<CustomerSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Search customers via integration layer
  const handleCustomerSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const results = await searchCustomers(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Failed to search customers:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useMemo(() => {
    const timeout = setTimeout(() => {
      handleCustomerSearch(customerSearch);
    }, 300);
    return () => clearTimeout(timeout);
  }, [customerSearch]);

  const selectedCustomer = useMemo(
    () => searchResults.find((c) => c.id === customerId) ?? null,
    [searchResults, customerId],
  );

  const canSubmit = title.trim() !== "" && customerId !== null;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!canSubmit || !selectedCustomer) {
      return;
    }

    const now = new Date().toISOString();

    const request: ServiceRequest = {
      id: `sr-${Date.now()}`,
      ticketNumber: `SD-${Math.floor(1000 + Math.random() * 9000)}`,
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      customerId: selectedCustomer.id,
      customer: {
        id: selectedCustomer.id,
        name: selectedCustomer.name,
      },
      createdDate: now,
      attachments: [],
      notes: [],
      timeline: [
        {
          id: `tl-${Date.now()}`,
          label: "Request created",
          timestamp: now,
          actor: selectedCustomer.name,
        },
      ],
    };

    onSubmit(request);

    setTitle("");
    setDescription("");
    setPriority("medium");
    setStatus("new");
    setCustomerId(null);
    setCustomerSearch("");
    setSearchResults([]);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-[var(--nebula-radius-lg)] border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-[var(--nebula-shadow-sm)]"
    >
      <h2 className="text-lg font-semibold text-[var(--nebula-text-primary)]">
        New Service Request
      </h2>

      {/* Customer — reuses Sales customers (no duplication) */}
      <div>
        <label className={labelClass}>Customer</label>

        <div className="relative">
          <button
            type="button"
            onClick={() => setCustomerOpen((prev) => !prev)}
            className={`${inputClass} flex items-center justify-between text-left`}
          >
            <span className="flex items-center gap-2">
              <UserRound
                size={16}
                className="text-[var(--nebula-text-secondary)]"
              />

              {selectedCustomer ? (
                <span className="font-medium">
                  {selectedCustomer.name}
                </span>
              ) : (
                <span className="text-[var(--nebula-text-muted)]">
                  Select an existing customer…
                </span>
              )}
            </span>

            <ChevronDown size={16} className="text-[var(--nebula-text-muted)]" />
          </button>

          {customerOpen && (
            <div className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface)] shadow-[var(--nebula-shadow-md)]">
              {isSearching ? (
                <div className="px-3 py-2 text-sm text-[var(--nebula-text-muted)]">
                  Loading customers…
                </div>
              ) : searchResults.length === 0 ? (
                <div className="px-3 py-2 text-sm text-[var(--nebula-text-muted)]">
                  No customers found.
                </div>
              ) : (
                searchResults.map((customer) => (
                  <button
                    key={customer.id}
                    type="button"
                    onClick={() => {
                      setCustomerId(customer.id);
                      setCustomerOpen(false);
                    }}
                    className="block w-full px-3 py-2 text-left text-sm transition-colors hover:bg-[var(--nebula-surface-muted)]"
                  >
                    <span className="font-medium text-[var(--nebula-text-primary)]">
                      {customer.name}
                    </span>

                    {customer.phone && (
                      <span className="ml-2 text-[var(--nebula-text-muted)]">
                        {customer.phone}
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <div>
        <label
          className={labelClass}
          htmlFor="sr-title"
        >
          Title
        </label>

        <input
          id="sr-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Short summary of the issue"
          className={inputClass}
        />
      </div>

      {/* Description */}
      <div>
        <label
          className={labelClass}
          htmlFor="sr-description"
        >
          Description
        </label>

        <textarea
          id="sr-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={4}
          placeholder="Details, symptoms, location…"
          className={`${inputClass} resize-y`}
        />
      </div>

      {/* Status + Priority */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            className={labelClass}
            htmlFor="sr-status"
          >
            Status
          </label>

          <select
            id="sr-status"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as ServiceRequestStatus)
            }
            className={inputClass}
          >
            {STATUS_OPTIONS.map((option) => (
              <option
                key={option}
                value={option}
              >
                {STATUS_LABELS[option]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            className={labelClass}
            htmlFor="sr-priority"
          >
            Priority
          </label>

          <select
            id="sr-priority"
            value={priority}
            onChange={(event) =>
              setPriority(event.target.value as ServicePriority)
            }
            className={inputClass}
          >
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
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-[var(--nebula-border)] px-4 py-2 text-sm font-medium text-[var(--nebula-text-secondary)] transition-colors hover:bg-[var(--nebula-surface-muted)]"
          >
            Cancel
          </button>
        ) : null}

        <button
          type="submit"
          disabled={!canSubmit}
          className="rounded-lg bg-[var(--nebula-primary)] px-4 py-2 text-sm font-semibold text-[var(--nebula-primary-foreground)] transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
        >
          Create Request
        </button>
      </div>
    </form>
  );
}
