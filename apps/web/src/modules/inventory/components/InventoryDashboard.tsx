import {
  useInventoryDashboard,
} from "../hooks/useInventoryDashboard";

import StockCard from "./StockCard";

import type {
  ProductMaster,
} from "../types/product.types";

import type {
  StockMovement,
} from "../types/inventory.types";

import type {
  WarehouseSummary,
} from "../hooks/useInventoryDashboard";


const MOVEMENT_LABEL: Record<
  StockMovement["type"],
  string
> = {
  "stock-in": "Stock In",
  "stock-out": "Stock Out",
  "adjustment": "Adjustment",
};


function formatMovementType(
  type: StockMovement["type"],
): string {
  return (
    MOVEMENT_LABEL[type] ?? type
  );
}


export default function InventoryDashboard() {
  const dashboard =
    useInventoryDashboard();

  const {
    isLoading,
    totalProducts,
    totalStock,
    inventoryValue,
    lowStockCount,
    lowStockItems,
    warehouseSummaries,
    recentMovements,
  } = dashboard;


  if (isLoading) {
    return (
      <div className="surface p-6 text-sm">
        Loading inventory dashboard…
      </div>
    );
  }


  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold">
          Inventory Dashboard
        </h1>

        <p className="mt-2 text-[var(--nebula-text-secondary)]">
          Real-time visibility into products, warehouses
          and stock movements. All figures are derived
          from the inventory engines — no stock is
          calculated or updated here.
        </p>
      </div>



      {/* 1. SUMMARY CARDS */}

      <div className="grid gap-4 md:grid-cols-4">

        <StockCard
          title="Total Products"
          value={totalProducts}
        />

        <StockCard
          title="Total Stock"
          value={totalStock}
        />

        <StockCard
          title="Inventory Value"
          value={`$${inventoryValue.toLocaleString()}`}
        />

        <StockCard
          title="Low Stock Items"
          value={lowStockCount}
        />

      </div>




      {/* 2. WAREHOUSE SUMMARY */}

      <div className="surface overflow-hidden">

        <h2 className="p-4 text-xl font-bold">
          Warehouse Overview
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">

            <thead>
              <tr className="border-b">

                <th className="p-3 text-left">
                  Warehouse
                </th>

                <th className="p-3 text-left">
                  Products
                </th>

                <th className="p-3 text-left">
                  Stock Quantity
                </th>

                <th className="p-3 text-left">
                  Status
                </th>

              </tr>
            </thead>


            <tbody>
              {warehouseSummaries.map(
                (
                  warehouse: WarehouseSummary,
                ) => (

                  <tr
                    key={warehouse.id}
                    className="border-b"
                  >

                    <td className="p-3">
                      {warehouse.name}
                    </td>

                    <td className="p-3">
                      {warehouse.productCount}
                    </td>

                    <td className="p-3">
                      {warehouse.stockQuantity}
                    </td>

                    <td className="p-3">
                      <span className={
                        warehouse.status === "active"
                          ? "text-green-600"
                          : "text-[var(--nebula-text-secondary)]"
                      }>
                        {warehouse.status}
                      </span>
                    </td>

                  </tr>

                ),
              )}

              {warehouseSummaries.length === 0 && (
                <tr>
                  <td
                    className="p-3 text-sm"
                    colSpan={4}
                  >
                    No warehouses found.
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

      </div>



      {/* 3. LOW STOCK ALERTS */}

      <div className="surface overflow-hidden">

        <h2 className="p-4 text-xl font-bold">
          Low Stock Alerts
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">

            <thead>
              <tr className="border-b">

                <th className="p-3 text-left">
                  Product
                </th>

                <th className="p-3 text-left">
                  SKU
                </th>

                <th className="p-3 text-left">
                  Current Stock
                </th>

                <th className="p-3 text-left">
                  Reorder Level
                </th>

                <th className="p-3 text-left">
                  Status
                </th>

              </tr>
            </thead>


            <tbody>
              {lowStockItems.map(
                (
                  product: ProductMaster,
                ) => {

                  const below =
                    product.currentStock <
                    (product.reorderLevel ?? 0);

                  return (
                    <tr
                      key={product.id}
                      className="border-b"
                    >

                      <td className="p-3">
                        {product.name}
                      </td>

                      <td className="p-3">
                        {product.sku}
                      </td>

                      <td className="p-3">
                        {product.currentStock}
                      </td>

                      <td className="p-3">
                        {product.reorderLevel ?? "—"}
                      </td>

                      <td className="p-3">
                        <span className={
                          below
                            ? "text-red-600"
                            : "text-amber-600"
                        }>
                          {below
                            ? "Reorder Now"
                            : "At Reorder Level"}
                        </span>
                      </td>

                    </tr>
                  );
                },
              )}

              {lowStockItems.length === 0 && (
                <tr>
                  <td
                    className="p-3 text-sm"
                    colSpan={5}
                  >
                    No low stock items. All products are
                    above their reorder level.
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

      </div>





      {/* 4. RECENT STOCK ACTIVITY */}

      <div className="surface overflow-hidden">

        <h2 className="p-4 text-xl font-bold">
          Recent Stock Activity
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">

            <thead>
              <tr className="border-b">

                <th className="p-3 text-left">
                  Date
                </th>

                <th className="p-3 text-left">
                  Product
                </th>

                <th className="p-3 text-left">
                  Type
                </th>

                <th className="p-3 text-left">
                  Quantity
                </th>

                <th className="p-3 text-left">
                  Reference Type
                </th>

                <th className="p-3 text-left">
                  Reference ID
                </th>

              </tr>
            </thead>


            <tbody>
              {recentMovements.map(
                (
                  movement: StockMovement,
                ) => (

                  <tr
                    key={movement.id}
                    className="border-b"
                  >

                    <td className="p-3">
                      {movement.createdAt}
                    </td>

                    <td className="p-3">
                      {movement.productName}
                    </td>

                    <td className="p-3">
                      {formatMovementType(
                        movement.type,
                      )}
                    </td>

                    <td className="p-3">
                      {movement.quantity}
                    </td>

                    <td className="p-3">
                      {movement.referenceType ??
                        "—"}
                    </td>

                    <td className="p-3">
                      {movement.referenceId ??
                        "—"}
                    </td>

                  </tr>

                ),
              )}

              {recentMovements.length === 0 && (
                <tr>
                  <td
                    className="p-3 text-sm"
                    colSpan={6}
                  >
                    No stock activity yet.
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

      </div>



      {/* 5. QUICK ACTIONS */}

      <div className="surface p-5">

        <h2 className="text-xl font-bold">
          Quick Actions
        </h2>

        <div className="mt-4 flex flex-wrap gap-3">

          <a
            href="#inventory-products"
            className="rounded bg-black px-4 py-2 text-white"
          >
            Add Product
          </a>

          <a
            href="#inventory-adjustment"
            className="rounded bg-black px-4 py-2 text-white"
          >
            Stock Adjustment
          </a>

          <a
            href="#inventory-transfer"
            className="rounded bg-black px-4 py-2 text-white"
          >
            Stock Transfer
          </a>

        </div>

      </div>


    </div>
  );
}

