export { default as DashboardPage } from "./pages/DashboardPage";

export {
  useDashboardSummary,
  useInventorySummary,
  useRecentActivity,
} from "./hooks/useDashboard";

export { dashboardKeys } from "./queries/dashboard.keys";

export {
  getDashboardSummary,
  getInventorySummary,
  getRecentActivity,
} from "./services/dashboard.service";

export type {
  DashboardSummary,
  InventorySummary,
  ActivityItem,
  ActivityType,
} from "./types/dashboard.types";
