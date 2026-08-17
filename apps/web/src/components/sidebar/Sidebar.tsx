import { NavLink } from "react-router-dom";

import usePermission from "../../hooks/usePermission";

import { permissions } from "../../permissions/permissions";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    permission: permissions.DASHBOARD_VIEW,
  },
  {
    name: "Inventory",
    path: "/inventory",
    permission: permissions.INVENTORY_VIEW,
  },
  {
    name: "Sales",
    path: "/sales",
    permission: permissions.SALES_VIEW,
  },
  {
    name: "Purchase",
    path: "/purchase",
    permission: permissions.PURCHASE_VIEW,
  },
  {
    name: "CRM",
    path: "/crm",
    permission: permissions.CRM_VIEW,
  },
  {
    name: "Accounting",
    path: "/accounting",
    permission: permissions.ACCOUNTING_VIEW,
  },
  {
    name: "Reconciliation",
    path: "/reconciliation",
    permission: permissions.RECONCILIATION_VIEW,
  },
  {
    name: "Payments",
    path: "/payments",
    permission: permissions.PAYMENTS_VIEW,
  },
  {
    name: "Contacts",
    path: "/contacts",
    permission: permissions.CONTACTS_VIEW,
  },
  {
    name: "Expenses",
    path: "/expenses",
    permission: permissions.EXPENSES_VIEW,
  },
  {
    name: "Assets",
    path: "/assets",
    permission: permissions.ASSETS_VIEW,
  },
  {
    name: "Reports",
    path: "/reports",
    permission: permissions.REPORTS_VIEW,
  },
  {
    name: "Settings",
    path: "/settings",
    permission: permissions.SETTINGS_MANAGE,
  },
];

export default function Sidebar() {
  const { can } = usePermission();

  return (
    <aside className="w-64 border-r border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold">
          Nebula ERP
        </h1>

        <p className="text-sm text-[var(--nebula-text-muted)]">
          Enterprise Platform
        </p>
      </div>

      <nav className="space-y-1">
        {menuItems
          .filter((item) =>
            can(item.permission),
          )
          .map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm ${
                  isActive
                    ? "bg-[var(--nebula-primary)] text-white"
                    : "text-[var(--nebula-text-secondary)] hover:bg-[var(--nebula-surface-muted)]"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
      </nav>
    </aside>
  );
}