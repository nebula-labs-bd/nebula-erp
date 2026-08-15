import type {
  CustomerReceivable,
} from "../types/payment.types";

type CustomerReceivableTableProps = {
  receivables: CustomerReceivable[];
};

function statusClass(status: CustomerReceivable["status"]): string {
  switch (status) {
    case "paid":
      return "rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700";
    case "partial":
      return "rounded bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700";
    default:
      return "rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-700";
  }
}

export default function CustomerReceivableTable({
  receivables,
}: CustomerReceivableTableProps) {
  return (
    <div className="surface overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Customer</th>
            <th className="p-3 text-right">Invoice Amount</th>
            <th className="p-3 text-right">Received</th>
            <th className="p-3 text-right">Due</th>
            <th className="p-3 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {receivables.map((receivable) => (
            <tr
              key={receivable.customerId}
              className="border-b"
            >
              <td className="p-3 font-medium">
                {receivable.customerName}
              </td>

              <td className="p-3 text-right">
                ${receivable.invoiceAmount.toFixed(2)}
              </td>

              <td className="p-3 text-right">
                ${receivable.receivedAmount.toFixed(2)}
              </td>

              <td className="p-3 text-right">
                ${receivable.dueAmount.toFixed(2)}
              </td>

              <td className="p-3">
                <span className={statusClass(receivable.status)}>
                  {receivable.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}