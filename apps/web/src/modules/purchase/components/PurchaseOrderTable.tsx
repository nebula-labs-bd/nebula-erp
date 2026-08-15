import type { PurchaseOrder } from "../types/purchase.types";


type PurchaseOrderTableProps = {
  orders: PurchaseOrder[];
};


export default function PurchaseOrderTable({
  orders,
}: PurchaseOrderTableProps) {
  return (
    <div className="surface overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">PO Number</th>
            <th className="p-3 text-left">Supplier</th>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Total</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              className="border-b"
            >
              <td className="p-3 font-medium">
                {order.orderNumber}
              </td>

              <td className="p-3">
                {order.supplierId}
              </td>

              <td className="p-3">{order.date}</td>

              <td className="p-3">
                <span
                  className={
                    order.status === "received"
                      ? "rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700"
                      : order.status === "cancelled"
                        ? "rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-700"
                        : order.status === "pending"
                          ? "rounded bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700"
                          : "rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600"
                  }
                >
                  {order.status}
                </span>
              </td>

              <td className="p-3">
                ${order.total.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
