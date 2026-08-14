import {
  useStockAdjustments,
} from "../hooks/useStockAdjustment";

import {
  useProducts,
} from "../hooks/useProducts";

import {
  useWarehouses,
} from "../hooks/useWarehouse";

import {
  useUnits,
} from "../hooks/useUnits";

import type {
  StockAdjustment,
} from "../types/inventory.types";


export default function StockAdjustmentTable() {
  const {
    data: adjustments = [],
    isLoading,
  } =
    useStockAdjustments();


  const {
    data: products = [],
  } =
    useProducts();


  const {
    data: warehouses = [],
  } =
    useWarehouses();


  const {
    data: units = [],
  } =
    useUnits();


  function resolveName<T extends { id: string; name: string }>(
    list: T[],
    id: string,
  ): string {
    return (
      list.find(
        (item) => item.id === id,
      )?.name ?? id
    );
  }


  if (isLoading) {
    return (
      <div className="surface p-5 text-sm">
        Loading stock adjustments…
      </div>
    );
  }


  return (
    <div className="surface overflow-hidden">

      <h2 className="p-4 text-xl font-bold">
        Stock Adjustment History
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">

          <thead>
            <tr className="border-b">

              <th className="p-3 text-left">
                Product
              </th>

              <th className="p-3 text-left">
                Warehouse
              </th>

              <th className="p-3 text-left">
                Quantity
              </th>

              <th className="p-3 text-left">
                Unit
              </th>

              <th className="p-3 text-left">
                Adjustment Type
              </th>

              <th className="p-3 text-left">
                Reason
              </th>

              <th className="p-3 text-left">
                Date
              </th>

            </tr>
          </thead>


          <tbody>
            {adjustments.map(
              (adjustment: StockAdjustment) => (

                <tr
                  key={adjustment.id}
                  className="border-b"
                >

                  <td className="p-3">
                    {resolveName(
                      products,
                      adjustment.productId,
                    )}
                  </td>

                  <td className="p-3">
                    {resolveName(
                      warehouses,
                      adjustment.warehouseId,
                    )}
                  </td>

                  <td className="p-3">
                    {adjustment.quantity}
                  </td>

                  <td className="p-3">
                    {resolveName(
                      units,
                      adjustment.unitId,
                    )}
                  </td>

                  <td className="p-3">
                    {adjustment.type === "increase"
                      ? "Increase"
                      : "Decrease"}
                  </td>

                  <td className="p-3">
                    {adjustment.reason}
                  </td>

                  <td className="p-3">
                    {adjustment.createdAt}
                  </td>

                </tr>

              ),
            )}

            {adjustments.length === 0 && (
              <tr>
                <td
                  className="p-3 text-sm"
                  colSpan={7}
                >
                  No stock adjustments yet.
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

    </div>
  );
}
