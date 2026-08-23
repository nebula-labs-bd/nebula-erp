import type {
  ServiceDeskDashboardStats,
  ServiceRequest,
} from "../types/service-desk.types";

/**
 * Service Desk service — FRONTEND FOUNDATION ONLY.
 *
 * These are in-memory seed records so the UI can be developed end-to-end
 * without a backend. When the Service Desk API lands, replace this module
 * with calls through `apiClient` (e.g. `GET /service-desk/requests`). The
 * function signatures are intentionally API-shaped to minimise churn later.
 */

export const seedServiceRequests: ServiceRequest[] = [
  {
    id: "sr-1",
    ticketNumber: "SD-1001",
    title: "POS terminal not printing receipts",
    description:
      "Receipt printer at the downtown store stops mid-print during peak hours.",
    status: "in_progress",
    priority: "high",
    requesterContactId: "c-1",
    requester: { id: "c-1", name: "Bright Mart", company: "Bright Mart LLC" },
    billingContactId: "b-1",
    billing: { id: "b-1", name: "Bright Mart LLC" },
    assignedEmployeeId: "emp-1",
    assignedEmployee: { id: "emp-1", name: "Ava Stone", specialty: "Hardware" },
    createdDate: "2026-08-18T09:12:00.000Z",
    scheduledDate: "2026-08-22T14:00:00.000Z",
    attachments: [],
    notes: [],
    timeline: [
      {
        id: "tl-1",
        label: "Request created",
        timestamp: "2026-08-18T09:12:00.000Z",
        actor: "Bright Mart",
      },
      {
        id: "tl-2",
        label: "Assigned to Ava Stone",
        timestamp: "2026-08-19T11:00:00.000Z",
        actor: "Dispatch",
      },
    ],
  },
  {
    id: "sr-2",
    ticketNumber: "SD-1002",
    title: "Network drop in warehouse office",
    description: "Intermittent Wi-Fi drops affecting inventory scanners.",
    status: "scheduled",
    priority: "medium",
    requesterContactId: "c-2",
    requester: { id: "c-2", name: "Northgate Logistics" },
    assignedEmployeeId: "emp-2",
    assignedEmployee: { id: "emp-2", name: "Leo Park", specialty: "Network" },
    createdDate: "2026-08-20T13:40:00.000Z",
    scheduledDate: "2026-08-22T10:00:00.000Z",
    attachments: [],
    notes: [],
    timeline: [],
  },
  {
    id: "sr-3",
    ticketNumber: "SD-1003",
    title: "Quote for new server rack",
    description: "Customer requested a quote for a 12U wall-mounted rack.",
    status: "new",
    priority: "low",
    requesterContactId: "c-3",
    requester: { id: "c-3", name: "Coral Books" },
    createdDate: "2026-08-21T08:05:00.000Z",
    attachments: [],
    notes: [],
    timeline: [],
  },
  {
    id: "sr-4",
    ticketNumber: "SD-1004",
    title: "Critical: POS crash on checkout",
    description: "Storefront POS app crashes when applying loyalty discounts.",
    status: "waiting_customer",
    priority: "critical",
    requesterContactId: "c-1",
    requester: { id: "c-1", name: "Bright Mart", company: "Bright Mart LLC" },
    assignedEmployeeId: "emp-1",
    assignedEmployee: { id: "emp-1", name: "Ava Stone", specialty: "Hardware" },
    createdDate: "2026-08-17T16:20:00.000Z",
    scheduledDate: "2026-08-21T15:30:00.000Z",
    attachments: [],
    notes: [],
    timeline: [],
  },
  {
    id: "sr-5",
    ticketNumber: "SD-1005",
    title: "Annual maintenance completed",
    description: "Routine HVAC servicing at the warehouse completed.",
    status: "completed",
    priority: "medium",
    requesterContactId: "c-2",
    requester: { id: "c-2", name: "Northgate Logistics" },
    assignedEmployeeId: "emp-3",
    assignedEmployee: { id: "emp-3", name: "Mia Chen", specialty: "Facilities" },
    createdDate: "2026-08-10T09:00:00.000Z",
    scheduledDate: "2026-08-15T09:00:00.000Z",
    completedDate: "2026-08-15T12:30:00.000Z",
    attachments: [],
    notes: [],
    timeline: [],
  },
  {
    id: "sr-6",
    ticketNumber: "SD-1006",
    title: "Printer cartridge replacement",
    description: "Replace cyan cartridge in back-office printer.",
    status: "assigned",
    priority: "low",
    requesterContactId: "c-3",
    requester: { id: "c-3", name: "Coral Books" },
    assignedEmployeeId: "emp-2",
    assignedEmployee: { id: "emp-2", name: "Leo Park", specialty: "Network" },
    createdDate: "2026-08-21T10:15:00.000Z",
    attachments: [],
    notes: [],
    timeline: [],
  },
];

/** Aggregate the seed requests into dashboard cards. */
export function computeServiceDeskStats(
  requests: ServiceRequest[],
): ServiceDeskDashboardStats {
  const today = new Date().toISOString().slice(0, 10);

  const openStatuses: ServiceRequest["status"][] = [
    "new",
    "assigned",
    "in_progress",
    "waiting_customer",
  ];

  return {
    openTickets: requests.filter((r) => openStatuses.includes(r.status)).length,
    todaysSchedule: requests.filter((r) =>
      r.scheduledDate?.startsWith(today),
    ).length,
    pendingRequests: requests.filter((r) => r.status === "new").length,
    completedServices: requests.filter((r) => r.status === "completed").length,
  };
}
