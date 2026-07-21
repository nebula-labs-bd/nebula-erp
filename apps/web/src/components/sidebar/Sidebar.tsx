import { NavLink } from "react-router-dom";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    name: "Inventory",
    path: "/inventory",
  },
  {
    name: "Sales",
    path: "/sales",
  },
  {
    name: "Purchase",
    path: "/purchase",
  },
  {
    name: "CRM",
    path: "/crm",
  },
  {
    name: "Accounting",
    path: "/accounting",
  },
  {
    name: "Reports",
    path: "/reports",
  },
  {
    name: "Settings",
    path: "/settings",
  },
];

export default function Sidebar() {
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
        {menuItems.map((item) => (
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