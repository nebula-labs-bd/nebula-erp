import SalesTable from "../components/SalesTable";

import type { SalesOrder } from "../types/sales.types";


const demoOrders: SalesOrder[] = [
  {
    id: "SO-001",
    customer: "ABC Company",
    date: "2026-07-21",
    status: "completed",
    total: 2500,
  },
  {
    id: "SO-002",
    customer: "XYZ Ltd",
    date: "2026-07-20",
    status: "pending",
    total: 1200,
  },
];


export default function SalesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Sales Module
        </h1>

        <p className="mt-2 text-[var(--nebula-text-secondary)]">
          Manage sales orders and revenue.
        </p>
      </div>

      <SalesTable
        orders={demoOrders}
      />
    </div>
  );
}