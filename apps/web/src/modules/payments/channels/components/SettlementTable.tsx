import { usePaymentAccounts } from "../hooks/usePaymentAccounts";

import type {
  Settlement,
  SettlementStatus,
} from "../types/channel.types";

import type { Account } from "../../../accounting/types/accounting.types";

type SettlementTableProps = {
  settlements: Settlement[];
  bankAccounts: Account[];
};

function statusClass(status: SettlementStatus): string {
  switch (status) {
    case "completed":
      return "rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700";
    case "cancelled":
      return "rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-700";
    default:
      return "rounded bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700";
  }
}

export default function SettlementTable({
  settlements,
  bankAccounts,
}: SettlementTableProps) {
  const { data: paymentAccounts = [] } = usePaymentAccounts();

  const getPaymentAccountName = (id: string) => {
    const account = paymentAccounts.find((a) => a.id === id);
    return account
      ? `${account.name} (${account.type}${account.provider ? ` - ${account.provider}` : ""})`
      : "Unknown";
  };

  const getBankAccountName = (id: string) => {
    const account = bankAccounts.find((a) => a.id === id);
    return account ? `${account.code} - ${account.name}` : "Unknown";
  };

  return (
    <div className="surface overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Source Account</th>
            <th className="p-3 text-right">Amount</th>
            <th className="p-3 text-left">Destination Bank</th>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {settlements.map((settlement) => (
            <tr key={settlement.id} className="border-b">
              <td className="p-3">
                {getPaymentAccountName(settlement.paymentAccountId)}
              </td>

              <td className="p-3 text-right font-medium">
                ${settlement.amount.toFixed(2)}
              </td>

              <td className="p-3">
                {getBankAccountName(settlement.bankAccountId)}
              </td>

              <td className="p-3">{settlement.settlementDate}</td>

              <td className="p-3">
                <span className={statusClass(settlement.status)}>
                  {settlement.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}