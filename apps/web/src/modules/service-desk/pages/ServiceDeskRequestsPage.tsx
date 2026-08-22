import { useState } from "react";

import { Plus } from "lucide-react";

import { useServiceRequests } from "../hooks/useServiceDesk";
import ServiceRequestList from "../components/ServiceRequestList";
import NewRequestForm from "../components/NewRequestForm";

import type { ServiceRequest } from "../types/service-desk.types";

/**
 * Service Desk — Requests.
 *
 * Lists all service requests with filtering, and reveals the New Request form
 * inline (Part 9 of the foundation). The form links customers to the existing
 * Sales source of truth — no duplicate contacts are created.
 */
export default function ServiceDeskRequestsPage() {
  const { requests, addRequest } = useServiceRequests();
  const [showForm, setShowForm] = useState(false);

  function handleCreate(request: ServiceRequest) {
    addRequest(request);
    setShowForm(false);
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-[var(--nebula-text-primary)]">
            Service Requests
          </h1>

          <p className="text-[var(--nebula-text-secondary)]">
            Triage, dispatch and track every service ticket.
          </p>
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-lg bg-[var(--nebula-primary)] px-4 py-2 text-sm font-semibold text-[var(--nebula-primary-foreground)] transition-opacity hover:opacity-90"
          >
            <Plus
              size={16}
              strokeWidth={2.5}
            />
            New Request
          </button>
        )}
      </header>

      {showForm && (
        <NewRequestForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      <ServiceRequestList requests={requests} />
    </div>
  );
}
