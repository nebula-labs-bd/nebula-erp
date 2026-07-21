import type { SalesOrder } from "../types/sales.types";


type SalesTableProps = {
  orders: SalesOrder[];
};


export default function SalesTable({
  orders,
}: SalesTableProps) {
  return (
    <div className="surface overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">
              Customer
            </th>

            <th className="p-3 text-left">
              Date
            </th>

            <th className="p-3 text-left">
              Status
            </th>

            <th className="p-3 text-left">
              Total
            </th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              className="border-b"
            >
              <td className="p-3">
                {order.customer}
              </td>

              <td className="p-3">
                {order.date}
              </td>

              <td className="p-3">
                {order.status}
              </td>

              <td className="p-3">
                ${order.total}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}