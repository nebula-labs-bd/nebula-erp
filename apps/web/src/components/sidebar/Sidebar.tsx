const menuItems = [
  "Dashboard",
  "Inventory",
  "Sales",
  "Purchase",
  "CRM",
  "Accounting",
  "Reports",
  "Settings",
];

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-[var(--nebula-text-primary)]">
          Nebula ERP
        </h1>

        <p className="text-sm text-[var(--nebula-text-muted)]">
          Enterprise Platform
        </p>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => (
          <button
            key={item}
            className="w-full rounded-lg px-3 py-2 text-left text-sm text-[var(--nebula-text-secondary)] hover:bg-[var(--nebula-surface-muted)]"
          >
            {item}
          </button>
        ))}
      </nav>
    </aside>
  );
}