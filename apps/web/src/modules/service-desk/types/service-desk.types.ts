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
 * Reference to an existing CRM / contact record.
 *
 * Integration point (Part 10): the service desk MUST NOT create duplicate
 * customers. A request links to the same customer identity used across CRM,
 * sales and invoicing. Future: surface sales history, service history and
 * outstanding invoices alongside the request.
 */
export interface ServiceCustomerRef {
  id: string;
  name: string;
  company?: string;
}

/**
 * Reference to an existing business entity (a company the customer belongs to).
 * Reuses the CRM business identity rather than duplicating it.
 */
export interface ServiceBusinessRef {
  id: string;
  name: string;
}

export interface ServiceTechnician {
  id: string;
  name: string;
  specialty?: string;
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

  /** Existing CRM contact id (no duplication). */
  customerId?: string;
  customer?: ServiceCustomerRef;

  /** Existing business id (no duplication). */
  businessId?: string;
  business?: ServiceBusinessRef;

  assignedTechnician?: ServiceTechnician;

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
