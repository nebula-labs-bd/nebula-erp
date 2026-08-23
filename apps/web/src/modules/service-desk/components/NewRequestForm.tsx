import { useState } from "react";

import { PRIORITY_LABELS, STATUS_LABELS } from "../utils/service-desk.utils";
import type {
  ServicePriority,
  ServiceRequest,
  ServiceRequestStatus,
} from "../types/service-desk.types";
import ContactSelector from "../../contacts/components/ContactSelector";
import type { ContactSearchResult } from "integrations/customer";

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
 * The requester & billing pickers use the shared `ContactSelector` backed by
 * the global Contact Registry (`searchContacts`). The service desk NEVER
 * creates a duplicate contact — it only links by id.
 */
export default function NewRequestForm({
  onSubmit,
  onCancel,
}: NewRequestFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<ServicePriority>("medium");
  const [status, setStatus] = useState<ServiceRequestStatus>("new");
  const [requesterId, setRequesterId] = useState<string | null>(null);
  const [requester, setRequester] = useState<ContactSearchResult | null>(null);
  const [billingId, setBillingId] = useState<string | null>(null);

  const canSubmit = title.trim() !== "" && requesterId !== null;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!canSubmit) {
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
      requesterContactId: requesterId ?? undefined,
      requester: requester
        ? { id: requester.id, name: requester.name }
        : undefined,
      billingContactId: billingId ?? undefined,
      createdDate: now,
      attachments: [],
      notes: [],
      timeline: [
        {
          id: `tl-${Date.now()}`,
          label: "Request created",
          timestamp: now,
          actor: requester?.name ?? "Unassigned",
        },
      ],
    };

    onSubmit(request);

    setTitle("");
    setDescription("");
    setPriority("medium");
    setStatus("new");
    setRequesterId(null);
    setRequester(null);
    setBillingId(null);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-[var(--nebula-radius-lg)] border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-[var(--nebula-shadow-sm)]"
    >
      <h2 className="text-lg font-semibold text-[var(--nebula-text-primary)]">
        New Service Request
      </h2>

      {/* Requester + Billing — shared Contact Registry (no duplication) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ContactSelector
          label="Requester *"
          value={requesterId}
          filterRoles={["customer", "partner"]}
          onChange={(id, result) => {
            setRequesterId(id);
            setRequester(result ?? null);
          }}
        />

        <ContactSelector
          label="Billing contact"
          value={billingId}
          onChange={(id) => setBillingId(id)}
        />
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
