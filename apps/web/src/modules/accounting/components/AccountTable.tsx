import type { Account } from "../types/accounting.types";

type AccountTableProps = {
  accounts: Account[];
};

export default function AccountTable({ accounts }: AccountTableProps) {
  return (
    <div className="surface overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Code</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Type</th>
            <th className="p-3 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {accounts.map((account) => (
            <tr key={account.id} className="border-b">
              <td className="p-3 font-medium">{account.code}</td>

              <td className="p-3">{account.name}</td>

              <td className="p-3">
                <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                  {account.type}
                </span>
              </td>

              <td className="p-3">
                <span
                  className={
                    account.status === "active"
                      ? "rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700"
                      : "rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600"
                  }
                >
                  {account.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}