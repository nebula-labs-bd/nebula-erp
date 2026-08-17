import { formatCurrency } from "../utils/format";

import type { FinancialSummary } from "../types/report.types";

type FinancialSummaryCardsProps = {
  summary?: FinancialSummary;
  isLoading?: boolean;
};

type MetricCard = {
  label: string;
  value: number;
  tone: "default" | "positive" | "negative";
};

function cardClass(tone: MetricCard["tone"]): string {
  if (tone === "positive") {
    return "rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-4";
  }

  if (tone === "negative") {
    return "rounded-lg border border-red-200 bg-red-50 p-4";
  }

  return "rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-4";
}

function valueClass(tone: MetricCard["tone"]): string {
  if (tone === "negative") {
    return "mt-1 text-xl font-bold text-red-700";
  }

  return "mt-1 text-xl font-bold";
}

function MetricCard({ label, value, tone }: MetricCard) {
  return (
    <div className={cardClass(tone)}>
      <p className="text-sm text-[var(--nebula-text-secondary)]">{label}</p>

      <p className={valueClass(tone)}>{formatCurrency(value)}</p>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-20 animate-pulse rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface)]"
        />
      ))}
    </div>
  );
}

export default function FinancialSummaryCards({
  summary,
  isLoading,
}: FinancialSummaryCardsProps) {
  if (isLoading) {
    return <Skeleton />;
  }

  if (!summary) {
    return (
      <p className="text-[var(--nebula-text-secondary)]">
        No financial summary available.
      </p>
    );
  }

  const cards: MetricCard[] = [
    { label: "Sales", value: summary.totalSales, tone: "default" },
    { label: "Purchases", value: summary.totalPurchases, tone: "default" },
    { label: "Expenses", value: summary.totalExpenses, tone: "default" },
    { label: "Assets", value: summary.totalAssets, tone: "default" },
    { label: "Receivables", value: summary.totalReceivable, tone: "positive" },
    { label: "Payables", value: summary.totalPayable, tone: "negative" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      {cards.map((card) => (
        <MetricCard key={card.label} {...card} />
      ))}
    </div>
  );
}
