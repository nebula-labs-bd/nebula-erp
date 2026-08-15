import type { ContactLedgerEntry, LedgerReferenceType } from "../types/contact.types";

type ContactLedgerTableProps = {
  entries: ContactLedgerEntry[];
};

function referenceTypeBadge(type: LedgerReferenceType): string {
  const base = "rounded px-2 py-1 text-xs font-medium";
  switch (type) {
    case "purchase":
      return `${base} bg-purple-100 text-purple-700`;
    case "sale":
      return `${base} bg-blue-100 text-blue-700`;
    case "payment":
      return `${base} bg-green-100 text-green-700`;
    default:
      return `${base} bg-gray-100 text-gray-700`;
  }
}

export default function ContactLedgerTable({ entries }: ContactLedgerTableProps) {
  return (
    <div className="surface overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Description</th>
            <th className="p-3 text-left">Reference</th>
            <th className="p-3 text-right">Debit</th>
            <th className="p-3 text-right">Credit</th>
            <th className="p-3 text-right">Balance</th>
          </tr>
        </thead>

        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id} className="border-b">
              <td className="p-3">{entry.date}</td>

              <td className="p-3">{entry.description}</td>

              <td className="p-3">
                <span className={referenceTypeBadge(entry.referenceType)}>
                  {entry.referenceType}
                </span>
                <span className="ml-2 text-sm text-gray-500">#{entry.referenceId}</span>
              </td>

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