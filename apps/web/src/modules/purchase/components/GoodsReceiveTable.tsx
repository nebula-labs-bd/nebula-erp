import type { GoodsReceive } from "../types/purchase.types";


type GoodsReceiveTableProps = {
  goodsReceives: GoodsReceive[];
};


export default function GoodsReceiveTable({
  goodsReceives,
}: GoodsReceiveTableProps) {
  return (
    <div className="surface overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Purchase Order</th>
            <th className="p-3 text-left">Warehouse</th>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {goodsReceives.map((gr) => (
            <tr
              key={gr.id}
              className="border-b"
            >
              <td className="p-3">
                {gr.purchaseOrderId}
              </td>

              <td className="p-3">
                {gr.warehouseId}
              </td>

              <td className="p-3">{gr.date}</td>

              <td className="p-3">
                <span
                  className={
                    gr.status === "received"
                      ? "rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700"
                      : gr.status === "partial"
                        ? "rounded bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700"
                        : "rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600"
                  }
                >
                  {gr.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
