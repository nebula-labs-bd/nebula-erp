import { useMemo, useState } from "react";

import {
  seedServiceRequests,
  computeServiceDeskStats,
} from "../services/service-desk.service";

import type {
  ServiceDeskDashboardStats,
  ServiceRequest,
  ServiceRequestStatus,
} from "../types/service-desk.types";

/**
 * Service Desk data hook — FRONTEND FOUNDATION ONLY.
 *
 * Holds the in-memory seed requests in local state so the UI works end to end
 * without a backend. The public surface deliberately mirrors what a future
 * `useQuery` / `useMutation` layer will expose (list, stats, add) so wiring
 * real APIs later is a drop-in change.
 */
export function useServiceRequests() {
  const [requests, setRequests] = useState<ServiceRequest[]>(
    seedServiceRequests,
  );

  const addRequest = (request: ServiceRequest) => {
    setRequests((prev) => [request, ...prev]);
  };

  const updateStatus = (
    id: string,
    status: ServiceRequestStatus,
  ) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status, completedDate: status === "completed" ? new Date().toISOString() : r.completedDate }
          : r,
      ),
    );
  };

  return { requests, addRequest, updateStatus };
}

/** Derived dashboard metrics for the service desk overview cards. */
export function useServiceDeskStats(
  requests: ServiceRequest[],
): ServiceDeskDashboardStats {
  return useMemo(() => computeServiceDeskStats(requests), [requests]);
}
