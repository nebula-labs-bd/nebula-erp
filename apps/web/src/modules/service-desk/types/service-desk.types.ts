/**
 * Service Desk — domain types.
 *
 * Enterprise service request / work order management. This is the
 * frontend foundation only: no backend calls are made yet. The shapes below
 * mirror the planned API contract so the UI can be built and later wired to
 * real data without structural changes.
 */

/* ------------------------------------------------------------------ */
/* Enumerations                                                       */
/* ------------------------------------------------------------------ */

export type ServiceRequestStatus =
  | "new"
  | "assigned"
  | "scheduled"
  | "in_progress"
  | "waiting_customer"
  | "completed"
  | "cancelled";

export type ServicePriority = "low" | "medium" | "high" | "critical";

/* ------------------------------------------------------------------ */
/* Supporting entities                                                */
/* ------------------------------------------------------------------ */

export interface ServiceAttachment {
  id: string;
  name: string;
  url: string;
}

export interface ServiceNote {
  id: string;
  author: string;
  body: string;
  createdAt: string;
}

export interface ServiceTimelineEvent {
  id: string;
  label: string;
  timestamp: string;
  actor?: string;
}

/**
 * Reference to the assigned employee (technician/agent). Resolves against the
 * shared Employee registry from `core` — the service desk must NOT keep its
 * own copy of staff. Display-only fields are denormalised for convenience.
 */
export interface ServiceEmployeeRef {
  id: string;
  name: string;
  specialty?: string;
}

/**
 * Lightweight reference to a contact from the shared Contact registry.
 * The service desk NEVER duplicates contact data — it links by id and keeps
 * only a denormalised display name for convenience.
 */
export interface ServiceContactRef {
  id: string;
  name: string;
  company?: string;
}

/* ------------------------------------------------------------------ */
/* Core entity                                                        */
/* ------------------------------------------------------------------ */

export interface ServiceRequest {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  status: ServiceRequestStatus;
  priority: ServicePriority;

  /**
   * Existing contact id from the shared Contact registry (no duplication).
   * The person or organization that raised the request.
   */
  requesterContactId?: string;
  requester?: ServiceContactRef;

  /**
   * Existing contact id from the shared Contact registry used for billing
   * (may differ from the requester, e.g. an organization billed for an
   * individual's service).
   */
  billingContactId?: string;
  billing?: ServiceContactRef;

  /**
   * Id of the assigned employee in the shared `core` Employee registry.
   * Replaces the previous `assignedTechnician` copy (integration point:
   * the same technician record is reused by HR, scheduling and payroll).
   */
  assignedEmployeeId?: string;
  assignedEmployee?: ServiceEmployeeRef;

  createdDate: string;
  scheduledDate?: string;
  completedDate?: string;

  attachments: ServiceAttachment[];
  notes: ServiceNote[];
  timeline: ServiceTimelineEvent[];
}

/* ------------------------------------------------------------------ */
/* Aggregated dashboard metrics                                       */
/* ------------------------------------------------------------------ */

export interface ServiceDeskDashboardStats {
  openTickets: number;
  todaysSchedule: number;
  pendingRequests: number;
  completedServices: number;
}
