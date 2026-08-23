/* Service Desk module — public surface. */
export { default as ServiceDeskDashboardPage } from "./pages/ServiceDeskDashboardPage";
export { default as ServiceDeskRequestsPage } from "./pages/ServiceDeskRequestsPage";
export { default as ServiceDeskTechniciansPage } from "./pages/ServiceDeskTechniciansPage";
export { default as ServiceDeskSchedulePage } from "./pages/ServiceDeskSchedulePage";
export { default as ServiceDeskReportsPage } from "./pages/ServiceDeskReportsPage";

export {
  useServiceRequests,
  useServiceDeskStats,
} from "./hooks/useServiceDesk";

export { serviceDeskKeys } from "./queries/service-desk.keys";

export {
  seedServiceRequests,
  computeServiceDeskStats,
} from "./services/service-desk.service";

export type {
  ServiceRequest,
  ServiceRequestStatus,
  ServicePriority,
  ServiceDeskDashboardStats,
  ServiceContactRef,
  ServiceEmployeeRef,
} from "./types/service-desk.types";
