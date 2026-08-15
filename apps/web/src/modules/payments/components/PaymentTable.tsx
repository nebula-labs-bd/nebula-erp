import type { Payment } from "../types/payment.types";

type PaymentTableProps = {
  payments: Payment[];
};

function statusClass(status: Payment["status"]): string {
  switch (status) {
    case "completed":
      return "rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700";
    case "cancelled":
      return "rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-700";
    default:
      return "rounded bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700";
  }
}

function typeLabel(type: Payment["type"]): string {
  return type === "payable" ? "Payable" : "Receivable";
}

export default function PaymentTable({ payments }: PaymentTableProps) {
  return (
    <div className="surface overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Type</th>
            <th className="p-3 text-left">Party</th>
            <th className="p-3 text-right">Amount</th>
            <th className="p-3 text-left">Method</th>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Reference</th>
          </tr>
        </thead>

        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id} className="border-b">
              <td className="p-3">
                <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                  {typeLabel(payment.type)}
                </span>
              </td>

              <td className="p-3">{payment.partyId}</td>

              <td className="p-3 text-right font-medium">
                ${payment.amount.toFixed(2)}
              </td>

              <td className="p-3">{payment.method}</td>

              <td className="p-3">{payment.date}</td>

              <td className="p-3">
                <span className={statusClass(payment.status)}>
                  {payment.status}
                </span>
              </td>

              <td className="p-3">{payment.reference}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}