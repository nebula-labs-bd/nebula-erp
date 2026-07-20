export default function Dashboard() {
  return (
    <section className="space-y-4">
      <div className="surface p-6">
        <h1 className="text-2xl font-bold">
          Welcome to Nebula ERP
        </h1>

        <p className="mt-2 text-[var(--nebula-text-secondary)]">
          Your enterprise management workspace.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="surface p-5">
          <h3 className="font-semibold">
            Sales
          </h3>
          <p className="text-sm text-[var(--nebula-text-muted)]">
            Manage orders and revenue.
          </p>
        </div>

        <div className="surface p-5">
          <h3 className="font-semibold">
            Inventory
          </h3>
          <p className="text-sm text-[var(--nebula-text-muted)]">
            Track products and stock.
          </p>
        </div>

        <div className="surface p-5">
          <h3 className="font-semibold">
            Customers
          </h3>
          <p className="text-sm text-[var(--nebula-text-muted)]">
            Manage relationships.
          </p>
        </div>
      </div>
    </section>
  );
}