import { Wallet, ArrowDownLeft, ArrowUpRight } from "lucide-react";

import MetricCard from "./MetricCard";

import type { DashboardSummary } from "../types/dashboard.types";

type FinancialSnapshotProps = {
  summary?: DashboardSummary;
  isLoading?: boolean;
};

function Skeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="h-28 animate-pulse rounded-[var(--nebula-radius-lg)] border border-[var(--nebula-border)] bg-[var(--nebula-surface)]"
        />
      ))}
    </div>
  );
}

/** Liquidity and obligations — the financial snapshot. */
export default function FinancialSnapshot({
  summary,
  isLoading,
}: FinancialSnapshotProps) {
  if (isLoading) {
    return <Skeleton />;
  }

  if (!summary) {
    return (
      <p className="text-[var(--nebula-text-secondary)]">
        No financial snapshot available.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <MetricCard
        label="Cash Balance"
        value={summary.cashBalance}
        icon={Wallet}
        tone="info"
      />

      <MetricCard
        label="Receivable"
        value={summary.receivable}
        icon={ArrowDownLeft}
        tone="positive"
      />

      <MetricCard
        label="Payable"
        value={summary.payable}
        icon={ArrowUpRight}
        tone="negative"
      />
    </div>
  );
}
