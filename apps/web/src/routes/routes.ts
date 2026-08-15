import Dashboard from "../pages/Dashboard";

import InventoryPage from "../modules/inventory/pages/InventoryPage";
import PurchasePage from "../modules/purchase/pages/PurchasePage";
import SalesPage from "../modules/sales/pages/SalesPage";
import CRMPage from "../modules/crm/pages/CRMPage";
import AccountingPage from "../modules/accounting/pages/AccountingPage";
import ReconciliationPage from "../modules/reconciliation/pages/ReconciliationPage";
import PaymentsPage from "../modules/payments/pages/PaymentsPage";
import ContactsPage from "../modules/contacts/pages/ContactsPage";
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
    path: "/purchase",
    element: PurchasePage,
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
    path: "/reconciliation",
    element: ReconciliationPage,
  },
  {
    path: "/payments",
    element: PaymentsPage,
  },
  {
    path: "/contacts",
    element: ContactsPage,
  },
  {
    path: "/settings",
    element: SettingsPage,
  },
];