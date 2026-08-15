import type { Delivery } from "../types/sales.types";


type DeliveryTableProps = {
  deliveries: Delivery[];
};


export default function DeliveryTable({
  deliveries,
}: DeliveryTableProps) {
  return (
    <div className="surface overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Sales Order</th>
            <th className="p-3 text-left">Warehouse</th>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {deliveries.map((delivery) => (
            <tr
              key={delivery.id}
              className="border-b"
            >
              <td className="p-3">
                {delivery.salesOrderId}
              </td>

              <td className="p-3">
                {delivery.warehouseId}
              </td>

              <td className="p-3">{delivery.date}</td>

              <td className="p-3">
                <span
                  className={
                    delivery.status === "delivered"
                      ? "rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700"
                      : delivery.status === "partial"
                        ? "rounded bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700"
                        : "rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600"
                  }
                >
                  {delivery.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
