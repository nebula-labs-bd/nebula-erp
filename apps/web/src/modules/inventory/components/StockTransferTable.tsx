import {
  useStockTransfers,
} from "../hooks/useStockTransfer";

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
  StockTransfer,
} from "../types/inventory.types";


export default function StockTransferTable() {
  const {
    data: transfers = [],
    isLoading,
  } =
    useStockTransfers();


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
        Loading stock transfers…
      </div>
    );
  }


  return (
    <div className="surface overflow-hidden">

      <h2 className="p-4 text-xl font-bold">
        Stock Transfer History
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">

          <thead>
            <tr className="border-b">

              <th className="p-3 text-left">
                Product
              </th>

              <th className="p-3 text-left">
                From Warehouse
              </th>

              <th className="p-3 text-left">
                To Warehouse
              </th>

              <th className="p-3 text-left">
                Quantity
              </th>

              <th className="p-3 text-left">
                Unit
              </th>

              <th className="p-3 text-left">
                Date
              </th>

              <th className="p-3 text-left">
                Note
              </th>

            </tr>
          </thead>


          <tbody>
            {transfers.map(
              (transfer: StockTransfer) => (

                <tr
                  key={transfer.id}
                  className="border-b"
                >

                  <td className="p-3">
                    {resolveName(
                      products,
                      transfer.productId,
                    )}
                  </td>

                  <td className="p-3">
                    {resolveName(
                      warehouses,
                      transfer.fromWarehouseId,
                    )}
                  </td>

                  <td className="p-3">
                    {resolveName(
                      warehouses,
                      transfer.toWarehouseId,
                    )}
                  </td>

                  <td className="p-3">
                    {transfer.quantity}
                  </td>

                  <td className="p-3">
                    {resolveName(
                      units,
                      transfer.unitId,
                    )}
                  </td>

                  <td className="p-3">
                    {transfer.createdAt}
                  </td>

                  <td className="p-3">
                    {transfer.note}
                  </td>

                </tr>

              ),
            )}

            {transfers.length === 0 && (
              <tr>
                <td
                  className="p-3 text-sm"
                  colSpan={7}
                >
                  No stock transfers yet.
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

    </div>
  );
}
