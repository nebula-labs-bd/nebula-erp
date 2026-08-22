import { permissions } from "../permissions/permissions";
import type { Permission } from "../permissions/permissions";
import type { NavigationItem } from "./navigation.types";

/**
 * Central navigation configuration for Nebula ERP.
 * This is the single source of truth for the sidebar navigation structure.
 * 
 * Organized as:
 * - Dashboard (single link)
 * - Operations (POS, Sales, Purchase)
 * - Inventory (Inventory, Products, Warehouses)
 * - CRM (Contacts)
 * - Finance (Accounting, Payments, Expenses, Assets, Tax, Reconciliation)
 * - Reports
 * - Administration (Settings)
 */

export const navigationConfig: NavigationItem[] = [
  // 🏠 Dashboard - standalone
  {
    id: "dashboard",
    name: "Dashboard",
    icon: "LayoutDashboard",
    path: "/dashboard",
    permission: permissions.DASHBOARD_VIEW,
    type: "link",
  },

  // ⚡ Operations
  {
    id: "operations",
    name: "Operations",
    icon: "Zap",
    type: "group",
    children: [
      {
        id: "pos",
        name: "POS",
        icon: "ShoppingCart",
        path: "/pos",
        permission: permissions.POS_VIEW,
        type: "link",
      },
      {
        id: "sales",
        name: "Sales",
        icon: "Receipt",
        path: "/sales",
        permission: permissions.SALES_VIEW,
        type: "link",
      },
      {
        id: "purchase",
        name: "Purchase",
        icon: "Truck",
        path: "/purchase",
        permission: permissions.PURCHASE_VIEW,
        type: "link",
      },
    ],
  },

  // 📦 Inventory
  {
    id: "inventory",
    name: "Inventory",
    icon: "Box",
    type: "group",
    children: [
      {
        id: "inventory",
        name: "Inventory",
        icon: "Boxes",
        path: "/inventory",
        permission: permissions.INVENTORY_VIEW,
        type: "link",
      },
      {
        id: "products",
        name: "Products",
        icon: "Package",
        path: "/products",
        permission: permissions.INVENTORY_VIEW,
        type: "link",
      },
      {
        id: "warehouses",
        name: "Warehouses",
        icon: "Warehouse",
        path: "/warehouses",
        permission: permissions.INVENTORY_VIEW,
        type: "link",
      },
    ],
  },

  // 👥 CRM
  {
    id: "crm",
    name: "CRM",
    icon: "Users",
    type: "group",
    children: [
      {
        id: "contacts",
        name: "Contacts",
        icon: "User",
        path: "/contacts",
        permission: permissions.CONTACTS_VIEW,
        type: "link",
      },
    ],
  },

  // 💰 Finance
  {
    id: "finance",
    name: "Finance",
    icon: "Wallet",
    type: "group",
    children: [
      {
        id: "accounting",
        name: "Accounting",
        icon: "BookOpen",
        path: "/accounting",
        permission: permissions.ACCOUNTING_VIEW,
        type: "link",
      },
      {
        id: "payments",
        name: "Payments",
        icon: "CreditCard",
        path: "/payments",
        permission: permissions.PAYMENTS_VIEW,
        type: "link",
      },
      {
        id: "expenses",
        name: "Expenses",
        icon: "FileText",
        path: "/expenses",
        permission: permissions.EXPENSES_VIEW,
        type: "link",
      },
      {
        id: "assets",
        name: "Assets",
        icon: "Building",
        path: "/assets",
        permission: permissions.ASSETS_VIEW,
        type: "link",
      },
      {
        id: "tax",
        name: "Tax",
        icon: "Percent",
        path: "/tax",
        permission: permissions.TAX_VIEW,
        type: "link",
      },
      {
        id: "reconciliation",
        name: "Reconciliation",
        icon: "Calculator",
        path: "/reconciliation",
        permission: permissions.RECONCILIATION_VIEW,
        type: "link",
      },
    ],
  },

  // 📊 Reports
  {
    id: "reports",
    name: "Reports",
    icon: "ChartBar",
    path: "/reports",
    permission: permissions.REPORTS_VIEW,
    type: "link",
  },

  // 🛠 Service Management
  {
    id: "service-desk",
    name: "Service Management",
    icon: "Headset",
    type: "group",
    children: [
      {
        id: "service-dashboard",
        name: "Dashboard",
        icon: "LayoutDashboard",
        path: "/service-dashboard",
        permission: permissions.SERVICE_DESK_VIEW,
        type: "link",
      },
      {
        id: "service-requests",
        name: "Requests",
        icon: "Ticket",
        path: "/service-requests",
        permission: permissions.SERVICE_DESK_VIEW,
        type: "link",
      },
      {
        id: "service-customers",
        name: "Customers",
        icon: "Users",
        path: "/service-customers",
        permission: permissions.SERVICE_DESK_VIEW,
        type: "link",
      },
      {
        id: "service-businesses",
        name: "Businesses",
        icon: "Building2",
        path: "/service-businesses",
        permission: permissions.SERVICE_DESK_VIEW,
        type: "link",
      },
      {
        id: "service-technicians",
        name: "Technicians",
        icon: "Wrench",
        path: "/service-technicians",
        permission: permissions.SERVICE_DESK_VIEW,
        type: "link",
      },
      {
        id: "service-schedule",
        name: "Schedule",
        icon: "CalendarDays",
        path: "/service-schedule",
        permission: permissions.SERVICE_DESK_VIEW,
        type: "link",
      },
      {
        id: "service-reports",
        name: "Reports",
        icon: "BarChart3",
        path: "/service-reports",
        permission: permissions.SERVICE_DESK_VIEW,
        type: "link",
      },
    ],
  },

  // ⚙ Administration
  {
    id: "administration",
    name: "Administration",
    icon: "Settings",
    type: "group",
    children: [
      {
        id: "settings",
        name: "Settings",
        icon: "SlidersHorizontal",
        path: "/settings",
        permission: permissions.SETTINGS_MANAGE,
        type: "link",
      },
    ],
  },
];

/**
 * Get all navigation items that are visible to the user based on permissions
 */
export function getVisibleNavigationItems(
  can: (permission: Permission) => boolean,
): NavigationItem[] {
  return navigationConfig
    .filter((item) => !item.permission || can(item.permission))
    .map((item) => {
      if (item.type === "group") {
        const visibleChildren = item.children.filter(
          (child) => !child.permission || can(child.permission),
        );
        return { ...item, children: visibleChildren };
      }
      return item;
    })
    .filter((item) => item.type !== "group" || item.children.length > 0);
}

/**
 * Get all flattened links from navigation config (for route matching)
 */
export function getAllNavigationLinks(): import("./navigation.types").NavigationLink[] {
  return flattenNavigationItems(navigationConfig);
}

import { flattenNavigationItems } from "./navigation.types";