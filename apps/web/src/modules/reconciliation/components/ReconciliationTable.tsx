import type { BankTransaction } from "../types/reconciliation.types";

import type { PossibleMatch } from "../services/matching.service";

type ReconciliationTableProps = {
  transactions: BankTransaction[];
  possibleMatches: Record<string, PossibleMatch[]>;
  onMatch?: (bankTransactionId: string, sourceId: string) => void;
};

function statusClass(status: BankTransaction["status"]): string {
  switch (status) {
    case "reconciled":
      return "rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700";
    case "matched":
      return "rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700";
    default:
      return "rounded bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700";
  }
}

function typeLabel(type: BankTransaction["type"]): string {
  return type === "credit" ? "Credit" : "Debit";
}

function describeMatch(match?: PossibleMatch): string {
  if (!match) return "—";

  const label =
    match.sourceType === "journal_entry"
      ? "Journal"
      : match.sourceType === "payment"
        ? "Payment"
        : "Settlement";

  return `${label} ${match.reference || match.sourceId.slice(0, 8)} ($${
    match.amount.toFixed(2)
  })`;
}

export default function ReconciliationTable({
  transactions,
  possibleMatches,
  onMatch,
}: ReconciliationTableProps) {
  return (
    <div className="surface overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Type</th>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Description</th>
            <th className="p-3 text-left">Reference</th>
            <th className="p-3 text-right">Amount</th>
            <th className="p-3 text-left">Possible Match</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-right">Action</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((transaction) => {
            const candidates = possibleMatches[transaction.id] ?? [];
            const best = candidates[0];

            return (
              <tr key={transaction.id} className="border-b">
                <td className="p-3">
                  <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                    {typeLabel(transaction.type)}
                  </span>
                </td>

                <td className="p-3">{transaction.date}</td>

                <td className="p-3">{transaction.description}</td>

                <td className="p-3">{transaction.reference ?? "—"}</td>

                <td className="p-3 text-right font-medium">
                  ${transaction.amount.toFixed(2)}
                </td>

                <td className="p-3">
                  {describeMatch(best)}

                  {candidates.length > 1 && (
                    <span className="ml-1 text-xs text-[var(--nebula-text-muted)]">
                      +{candidates.length - 1} more
                    </span>
                  )}
                </td>

                <td className="p-3">
                  <span className={statusClass(transaction.status)}>
                    {transaction.status}
                  </span>
                </td>

                <td className="p-3 text-right">
                  {transaction.status === "unmatched" &&
                    best &&
                    onMatch && (
                      <button
                        className="rounded bg-black px-3 py-1 text-xs text-white"
                        onClick={() =>
                          onMatch(transaction.id, best.sourceId)
                        }
                      >
                        Match
                      </button>
                    )}
                </td>
              </tr>
            );
          })}

          {transactions.length === 0 && (
            <tr>
              <td
                className="p-4 text-center text-sm text-[var(--nebula-text-muted)]"
                colSpan={8}
              >
                No bank transactions yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
