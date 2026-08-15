import type { PaymentAccount } from "../types/channel.types";

type PaymentAccountTableProps = {
  accounts: PaymentAccount[];
};

function statusClass(status: PaymentAccount["status"]): string {
  switch (status) {
    case "active":
      return "rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700";
    default:
      return "rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600";
  }
}

function typeClass(type: PaymentAccount["type"]): string {
  const colors: Record<PaymentAccount["type"], string> = {
    cash: "bg-gray-100 text-gray-700",
    bank: "bg-blue-100 text-blue-700",
    mobile_wallet: "bg-purple-100 text-purple-700",
    marketplace: "bg-orange-100 text-orange-700",
    gateway: "bg-teal-100 text-teal-700",
  };
  return `rounded ${colors[type]} px-2 py-1 text-xs font-medium`;
}

function formatType(type: PaymentAccount["type"]): string {
  return type
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function PaymentAccountTable({ accounts }: PaymentAccountTableProps) {
  return (
    <div className="surface overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Type</th>
            <th className="p-3 text-left">Provider</th>
            <th className="p-3 text-left">Account Number</th>
            <th className="p-3 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {accounts.map((account) => (
            <tr key={account.id} className="border-b">
              <td className="p-3 font-medium">{account.name}</td>

              <td className="p-3">
                <span className={typeClass(account.type)}>
                  {formatType(account.type)}
                </span>
              </td>

              <td className="p-3">
                {account.provider || (
                  <span className="text-[var(--nebula-text-secondary)]">—</span>
                )}
              </td>

              <td className="p-3">
                {account.accountNumber || (
                  <span className="text-[var(--nebula-text-secondary)]">—</span>
                )}
              </td>

              <td className="p-3">
                <span className={statusClass(account.status)}>
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