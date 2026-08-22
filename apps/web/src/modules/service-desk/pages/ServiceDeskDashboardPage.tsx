import { useServiceDeskStats, useServiceRequests } from "../hooks/useServiceDesk";
import ServiceDeskCards from "../components/ServiceDeskCards";
import ServiceRequestList from "../components/ServiceRequestList";

/**
 * Service Desk — Dashboard.
 *
 * Foundation surface: aggregates the in-memory seed requests into the KPI
 * cards and shows the most recent requests. No backend calls yet.
 */
export default function ServiceDeskDashboardPage() {
  const { requests } = useServiceRequests();
  const stats = useServiceDeskStats(requests);

  const recent = [...requests]
    .sort((a, b) => b.createdDate.localeCompare(a.createdDate))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-[var(--nebula-text-primary)]">
          Service Management
        </h1>

        <p className="text-[var(--nebula-text-secondary)]">
          Service requests, dispatch and field operations across all customers.
        </p>
      </header>

      <ServiceDeskCards stats={stats} />

      <section
        aria-label="Recent service requests"
        className="rounded-[var(--nebula-radius-lg)] border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-5 shadow-[var(--nebula-shadow-sm)]"
      >
        <h2 className="mb-4 text-lg font-semibold text-[var(--nebula-text-primary)]">
          Recent Requests
        </h2>

        <ServiceRequestList requests={recent} />
      </section>
    </div>
  );
}
