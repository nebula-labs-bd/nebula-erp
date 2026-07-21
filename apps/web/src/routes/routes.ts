import Dashboard from "../pages/Dashboard";
import Inventory from "../pages/Inventory";
import Sales from "../pages/Sales";
import Purchase from "../pages/Purchase";
import CRM from "../pages/CRM";
import Accounting from "../pages/Accounting";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";

export const routes = [
  {
    path: "/",
    element: Dashboard,
  },
  {
    path: "/dashboard",
    element: Dashboard,
  },
  {
    path: "/inventory",
    element: Inventory,
  },
  {
    path: "/sales",
    element: Sales,
  },
  {
    path: "/purchase",
    element: Purchase,
  },
  {
    path: "/crm",
    element: CRM,
  },
  {
    path: "/accounting",
    element: Accounting,
  },
  {
    path: "/reports",
    element: Reports,
  },
  {
    path: "/settings",
    element: Settings,
  },
];