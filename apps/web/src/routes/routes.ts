import Dashboard from "../pages/Dashboard";

import InventoryPage from "../modules/inventory/pages/InventoryPage";
import SalesPage from "../modules/sales/pages/SalesPage";
import CRMPage from "../modules/crm/pages/CRMPage";
import AccountingPage from "../modules/accounting/pages/AccountingPage";
import SettingsPage from "../modules/settings/pages/SettingsPage";


export const routes = [
  {
    path: "/dashboard",
    element: Dashboard,
  },
  {
    path: "/inventory",
    element: InventoryPage,
  },
  {
    path: "/sales",
    element: SalesPage,
  },
  {
    path: "/crm",
    element: CRMPage,
  },
  {
    path: "/accounting",
    element: AccountingPage,
  },
  {
    path: "/settings",
    element: SettingsPage,
  },
];