import { DollarSign, ShoppingCart, Receipt, TrendingUp } from "lucide-react";

import MetricCard from "./MetricCard";

import type { DashboardSummary } from "../types/dashboard.types";

type ExecutiveCardsProps = {
  summary?: DashboardSummary;
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

/** Top-line business performance for today — the executive overview. */
export default function ExecutiveCards({
  summary,
  isLoading,
}: ExecutiveCardsProps) {
  if (isLoading) {
    return <Skeleton />;
  }

  if (!summary) {
    return (
      <p className="text-[var(--nebula-text-secondary)]">
        No executive summary available.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        label="Sales Today"
        value={summary.salesToday}
        icon={DollarSign}
        tone="default"
      />

      <MetricCard
        label="Purchase Today"
        value={summary.purchaseToday}
        icon={ShoppingCart}
        tone="default"
      />

      <MetricCard
        label="Expenses"
        value={summary.expenseToday}
        icon={Receipt}
        tone="warning"
      />

      <MetricCard
        label="Profit"
        value={summary.profitToday}
        icon={TrendingUp}
        tone={summary.profitToday >= 0 ? "positive" : "negative"}
        hint={
          summary.profitToday >= 0
            ? "Net positive today"
            : "Net loss today"
        }
      />
    </div>
  );
}
