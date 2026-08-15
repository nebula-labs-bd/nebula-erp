import type { JournalEntry } from "../types/accounting.types";

type JournalEntryTableProps = {
  entries: JournalEntry[];
  onPost?: (id: string) => void;
};

function entryTotal(entry: JournalEntry): number {
  return entry.lines.reduce((sum, line) => sum + line.debit, 0);
}

function statusClass(status: JournalEntry["status"]): string {
  switch (status) {
    case "posted":
      return "rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700";
    case "cancelled":
      return "rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-700";
    default:
      return "rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600";
  }
}

export default function JournalEntryTable({
  entries,
  onPost,
}: JournalEntryTableProps) {
  return (
    <div className="surface overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Reference</th>
            <th className="p-3 text-left">Description</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-right">Total</th>
            <th className="p-3 text-right">Action</th>
          </tr>
        </thead>

        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id} className="border-b">
              <td className="p-3">{entry.date}</td>
              <td className="p-3 font-medium">{entry.reference}</td>
              <td className="p-3">{entry.description}</td>
              <td className="p-3">
                <span className={statusClass(entry.status)}>
                  {entry.status}
                </span>
              </td>
              <td className="p-3 text-right">
                ${entryTotal(entry).toFixed(2)}
              </td>
              <td className="p-3 text-right">
                {entry.status === "draft" && onPost && (
                  <button
                    className="rounded bg-black px-3 py-1 text-xs text-white"
                    onClick={() => onPost(entry.id)}
                  >
                    Post
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}