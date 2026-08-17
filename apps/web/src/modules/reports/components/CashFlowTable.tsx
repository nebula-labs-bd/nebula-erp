import { formatCurrency } from "../utils/format";

import type { CashFlowReport } from "../types/report.types";

type CashFlowTableProps = {
  report?: CashFlowReport;
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

export default function CashFlowTable({
  report,
  isLoading,
}: CashFlowTableProps) {
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
        No cash flow data available.
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
          <Row label="Cash In" amount={report.cashIn} />

          <Row label="Cash Out" amount={report.cashOut} />

          <Row label="Net Flow" amount={report.netCashFlow} emphasize />
        </tbody>
      </table>
    </div>
  );
}
