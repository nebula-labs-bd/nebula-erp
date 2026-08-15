import type {
  SupplierPayable,
} from "../types/payment.types";

type SupplierPayableTableProps = {
  payables: SupplierPayable[];
};

function statusClass(status: SupplierPayable["status"]): string {
  switch (status) {
    case "paid":
      return "rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700";
    case "partial":
      return "rounded bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700";
    default:
      return "rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-700";
  }
}

export default function SupplierPayableTable({
  payables,
}: SupplierPayableTableProps) {
  return (
    <div className="surface overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Supplier</th>
            <th className="p-3 text-right">Invoice Amount</th>
            <th className="p-3 text-right">Paid</th>
            <th className="p-3 text-right">Due</th>
            <th className="p-3 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {payables.map((payable) => (
            <tr
              key={payable.supplierId}
              className="border-b"
            >
              <td className="p-3 font-medium">
                {payable.supplierName}
              </td>

              <td className="p-3 text-right">
                ${payable.invoiceAmount.toFixed(2)}
              </td>

              <td className="p-3 text-right">
                ${payable.paidAmount.toFixed(2)}
              </td>

              <td className="p-3 text-right">
                ${payable.dueAmount.toFixed(2)}
              </td>

              <td className="p-3">
                <span className={statusClass(payable.status)}>
                  {payable.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}