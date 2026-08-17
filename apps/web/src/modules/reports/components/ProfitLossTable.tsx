import { formatCurrency } from "../utils/format";

import type { ProfitLossReport } from "../types/report.types";

type ProfitLossTableProps = {
  report?: ProfitLossReport;
  isLoading?: boolean;
};

function Row({
  label,
  amount,
  emphasize,
}: {
  label: string;
  amount: number;
  emphasize?: boolean;
}) {
  return (
    <tr
      className={
        emphasize
          ? "border-t border-[var(--nebula-border)] font-bold"
          : "border-b border-[var(--nebula-border)]"
      }
    >
      <td className="p-3">{label}</td>

      <td className="p-3 text-right">{formatCurrency(amount)}</td>
    </tr>
  );
}

export default function ProfitLossTable({
  report,
  isLoading,
}: ProfitLossTableProps) {
  if (isLoading) {
    return (
      <div className="surface overflow-hidden">
        <div className="h-32 animate-pulse" />
      </div>
    );
  }

  if (!report) {
    return (
      <p className="text-[var(--nebula-text-secondary)]">
        No profit &amp; loss data available.
      </p>
    );
  }

  return (
    <div className="surface overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--nebula-border)]">
            <th className="p-3 text-left">Line</th>
            <th className="p-3 text-right">Amount</th>
          </tr>
        </thead>

        <tbody>
          <Row label="Revenue" amount={report.revenue} />

          <Row label="Expenses" amount={report.expenses} />

          <Row label="Profit" amount={report.netProfit} emphasize />
        </tbody>
      </table>
    </div>
  );
}
