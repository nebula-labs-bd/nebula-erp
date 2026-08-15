import { useState } from "react";

import { usePaymentAllocations } from "../hooks/usePayments";

import type { Payment } from "../types/payment.types";

type PaymentAllocationTableProps = {
  payments: Payment[];
};

function documentTypeLabel(type: string): string {
  switch (type) {
    case "sales_invoice":
      return "Sales Invoice";
    case "purchase_invoice":
      return "Purchase Invoice";
    default:
      return type;
  }
}

export default function PaymentAllocationTable({
  payments,
}: PaymentAllocationTableProps) {
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>(
    payments[0]?.id ?? "",
  );

  const paymentId =
    selectedPaymentId || payments[0]?.id || "";

  const { data: allocations = [] } = usePaymentAllocations(paymentId);

  const selectedPayment = payments.find((p) => p.id === paymentId);

  return (
    <div className="surface overflow-hidden">
      <div className="border-b p-3">
        <select
          className="w-full max-w-md rounded border p-2"
          value={paymentId}
          onChange={(e) => setSelectedPaymentId(e.target.value)}
        >
          <option value="">Select Payment</option>
          {payments.map((payment) => (
            <option key={payment.id} value={payment.id}>
              {payment.type === "payable" ? "Pay" : "Receipt"}{" "}
              ${payment.amount.toFixed(2)} · {payment.date}
            </option>
          ))}
        </select>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Payment</th>
            <th className="p-3 text-left">Invoice</th>
            <th className="p-3 text-left">Type</th>
            <th className="p-3 text-right">Allocated</th>
            <th className="p-3 text-right">Amount</th>
            <th className="p-3 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {allocations.map((allocation) => (
            <tr key={allocation.id} className="border-b">
              <td className="p-3">
                {selectedPayment
                  ? `$${selectedPayment.amount.toFixed(2)} · ${selectedPayment.date}`
                  : allocation.paymentId}
              </td>
              <td className="p-3">{allocation.documentNumber}</td>
              <td className="p-3">
                <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                  {documentTypeLabel(allocation.documentType)}
                </span>
              </td>
              <td className="p-3 text-right font-medium">
                ${allocation.allocatedAmount.toFixed(2)}
              </td>
              <td className="p-3 text-right">
                ${allocation.documentTotal.toFixed(2)}
              </td>
              <td className="p-3">{allocation.documentDate}</td>
            </tr>
          ))}

          {allocations.length === 0 && (
            <tr>
              <td
                className="p-3 text-center text-sm text-[var(--nebula-text-secondary)]"
                colSpan={6}
              >
                No allocations yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}