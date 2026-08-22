import { DashboardPage } from "../modules/dashboard";

import InventoryPage from "../modules/inventory/pages/InventoryPage";
import PurchasePage from "../modules/purchase/pages/PurchasePage";
import SalesPage from "../modules/sales/pages/SalesPage";
import CRMPage from "../modules/crm/pages/CRMPage";
import AccountingPage from "../modules/accounting/pages/AccountingPage";
import ReconciliationPage from "../modules/reconciliation/pages/ReconciliationPage";
import PaymentsPage from "../modules/payments/pages/PaymentsPage";
import ContactsPage from "../modules/contacts/pages/ContactsPage";
import ExpensesPage from "../modules/expenses/pages/ExpensesPage";
import AssetsPage from "../modules/assets/pages/AssetsPage";
import TaxPage from "../modules/tax/pages/TaxPage";
import SettingsPage from "../modules/settings/pages/SettingsPage";
import ReportsPage from "../modules/reports/pages/ReportsPage";
import POSPage from "../modules/pos/pages/POSPage";

import {
  ServiceDeskDashboardPage,
  ServiceDeskRequestsPage,
  ServiceDeskCustomersPage,
  ServiceDeskBusinessesPage,
  ServiceDeskTechniciansPage,
  ServiceDeskSchedulePage,
  ServiceDeskReportsPage,
} from "../modules/service-desk";


export const routes = [
  {
    path: "/dashboard",
    element: DashboardPage,
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
    path: "/expenses",
    element: ExpensesPage,
  },
  {
    path: "/assets",
    element: AssetsPage,
  },
  {
    path: "/tax",
    element: TaxPage,
  },
  {
    path: "/settings",
    element: SettingsPage,
  },
  {
    path: "/reports",
    element: ReportsPage,
  },
  {
    path: "/pos",
    element: POSPage,
  },

  /* Service Desk module (foundation) */
  {
    path: "/service-dashboard",
    element: ServiceDeskDashboardPage,
  },
  {
    path: "/service-requests",
    element: ServiceDeskRequestsPage,
  },
  {
    path: "/service-customers",
    element: ServiceDeskCustomersPage,
  },
  {
    path: "/service-businesses",
    element: ServiceDeskBusinessesPage,
  },
  {
    path: "/service-technicians",
    element: ServiceDeskTechniciansPage,
  },
  {
    path: "/service-schedule",
    element: ServiceDeskSchedulePage,
  },
  {
    path: "/service-reports",
    element: ServiceDeskReportsPage,
  },
];