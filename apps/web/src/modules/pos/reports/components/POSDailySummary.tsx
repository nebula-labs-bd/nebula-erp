import { Loader2 } from "lucide-react";

import { formatCurrency } from "../../../dashboard/utils/format";

import { usePOSDailySummary } from "../hooks/usePOSReports";

import type { POSReportParams } from "../types/report.types";

type POSDailySummaryProps = {
  params: POSReportParams;
};

/**
 * POS Daily Summary card.
 * Read-only display of end-of-day register totals.
 */
export default function POSDailySummary({ params }: POSDailySummaryProps) {
  const { data, isLoading, isError } = usePOSDailySummary(params);

  return (
    <div className="surface p-4">
      <h3 className="mb-3 text-sm font-semibold text-[var(--nebula-text-primary)]">
        Daily Summary
      </h3>

      {isLoading && (
        <p className="flex items-center gap-1 text-xs text-[var(--nebula-text-muted)]">
          <Loader2 size={12} className="animate-spin" /> Loading…
        </p>
      )}

      {isError && (
        <p className="text-xs text-[var(--nebula-danger)]">
          Failed to load summary.
        </p>
      )}

      {data && (
        <div className="space-y-2">
          <Row label="Net Sales" value={formatCurrency(data.netSales)} bold />
          <Row label="Total Sales" value={formatCurrency(data.totalSales)} />
          <Row label="Refunds" value={formatCurrency(data.totalRefunds)} />
          <Row label="Transactions" value={String(data.transactionCount)} />
          <Row label="Avg Sale" value={formatCurrency(data.averageSale)} />
          <div className="my-2 border-t border-[var(--nebula-border)]" />
          <Row label="Opening Cash" value={formatCurrency(data.openingCash)} />
          <Row label="Expected Cash" value={formatCurrency(data.expectedCash)} />
          <Row label="Closing Cash" value={formatCurrency(data.closingCash)} />
          <Row
            label="Difference"
            value={formatCurrency(data.difference)}
            danger={data.difference !== 0}
          />
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  danger,
}: {
  label: string;
  value: string;
  bold?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-[var(--nebula-text-secondary)]">{label}</span>
      <span
        className={`${
          bold
            ? "font-semibold text-[var(--nebula-primary)]"
            : danger
              ? "font-semibold text-[var(--nebula-danger)]"
              : "text-[var(--nebula-text-primary)]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
