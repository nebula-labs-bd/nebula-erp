import { formatCurrency } from "../utils/format";

import type { BalanceSheetReport } from "../types/report.types";

type BalanceSheetTableProps = {
  report?: BalanceSheetReport;
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

export default function BalanceSheetTable({
  report,
  isLoading,
}: BalanceSheetTableProps) {
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
        No balance sheet data available.
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
          <Row label="Assets" amount={report.assets} />

          <Row label="Liabilities" amount={report.liabilities} />

          <Row label="Equity" amount={report.equity} emphasize />
        </tbody>
      </table>
    </div>
  );
}
