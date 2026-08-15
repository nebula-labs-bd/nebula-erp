import type { LedgerEntry } from "../types/accounting.types";

type GeneralLedgerTableProps = {
  entries: LedgerEntry[];
};

export default function GeneralLedgerTable({
  entries,
}: GeneralLedgerTableProps) {
  return (
    <div className="surface overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Account</th>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Description</th>
            <th className="p-3 text-right">Debit</th>
            <th className="p-3 text-right">Credit</th>
            <th className="p-3 text-right">Balance</th>
          </tr>
        </thead>

        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id} className="border-b">
              <td className="p-3">
                <div className="font-medium">
                  {entry.accountCode} - {entry.accountName}
                </div>
              </td>

              <td className="p-3">{entry.date}</td>

              <td className="p-3">{entry.description}</td>

              <td className="p-3 text-right">
                {entry.debit > 0 ? `$${entry.debit.toFixed(2)}` : "-"}
              </td>

              <td className="p-3 text-right">
                {entry.credit > 0 ? `$${entry.credit.toFixed(2)}` : "-"}
              </td>

              <td className="p-3 text-right font-medium">
                ${entry.balance.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}