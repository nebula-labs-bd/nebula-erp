import {
  Package,
  Coins,
  AlertTriangle,
  XCircle,
} from "lucide-react";

import MetricCard from "./MetricCard";

import type { InventorySummary } from "../types/dashboard.types";

type InventoryHealthProps = {
  summary?: InventorySummary;
  isLoading?: boolean;
};

function Skeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="h-28 animate-pulse rounded-[var(--nebula-radius-lg)] border border-[var(--nebula-border)] bg-[var(--nebula-surface)]"
        />
      ))}
    </div>
  );
}

/** Stock position and replenishment risk — inventory health. */
export default function InventoryHealth({
  summary,
  isLoading,
}: InventoryHealthProps) {
  if (isLoading) {
    return <Skeleton />;
  }

  if (!summary) {
    return (
      <p className="text-[var(--nebula-text-secondary)]">
        No inventory health data available.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        label="Products"
        value={summary.totalProducts}
        icon={Package}
        tone="default"
      />

      <MetricCard
        label="Stock Value"
        value={summary.stockValue}
        icon={Coins}
        tone="default"
        compact
      />

      <MetricCard
        label="Low Stock"
        value={summary.lowStockCount}
        icon={AlertTriangle}
        tone="warning"
      />

      <MetricCard
        label="Out of Stock"
        value={summary.outOfStockCount}
        icon={XCircle}
        tone="negative"
      />
    </div>
  );
}
