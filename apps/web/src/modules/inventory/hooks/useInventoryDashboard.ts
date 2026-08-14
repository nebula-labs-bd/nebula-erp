import {
  useQuery,
} from "@tanstack/react-query";

import {
  useProducts,
} from "./useProducts";

import {
  useWarehouses,
} from "./useWarehouse";

import {
  getInventorySummary,
  getStockMovements,
} from "../services/inventory.service";

import {
  inventoryKeys,
} from "../queries/inventory.keys";

import type {
  ProductMaster,
} from "../types/product.types";

import type {
  Warehouse,
  StockMovement,
  InventorySummary,
} from "../types/inventory.types";


export interface WarehouseSummary {
  id: string;
  name: string;
  productCount: number;
  stockQuantity: number;
  status: "active" | "inactive";
}


export interface InventoryDashboardData {
  isLoading: boolean;

  totalProducts: number;
  totalStock: number;
  inventoryValue: number;
  lowStockCount: number;

  summary?: InventorySummary;

  products: ProductMaster[];
  warehouses: Warehouse[];

  lowStockItems: ProductMaster[];
  warehouseSummaries: WarehouseSummary[];
  recentMovements: StockMovement[];
}


/**
 * VIEW / analytics layer only.
 *
 * Combines existing inventory queries (Product Master,
 * Warehouse, Stock Movement, Inventory Summary) into a
 * single read-model for the dashboard.
 *
 * No inventory calculations or stock mutations are
 * introduced here — every value is derived from data
 * already produced by the existing inventory engines.
 */
export function useInventoryDashboard():
  InventoryDashboardData {

  const {
    data: products = [],
    isLoading: productsLoading,
  } =
    useProducts();


  const {
    data: warehouses = [],
    isLoading: warehousesLoading,
  } =
    useWarehouses();


  const movementsQuery =
    useQuery({

      queryKey: [
        ...inventoryKeys.all,
        "stock-movements",
      ],

      queryFn:
        async () => {
          const response =
            await getStockMovements();

          return response.data;
        },
    });


  const summaryQuery =
    useQuery({

      queryKey:
        inventoryKeys.summary(),

      queryFn:
        async () => {
          const response =
            await getInventorySummary();

          return response.data;
        },
    });


  const productsList =
    products ?? [];

  const warehousesList =
    warehouses ?? [];

  const movements =
    movementsQuery.data ?? [];

  const summary =
    summaryQuery.data;


  // Total stock + value are aggregated from the
  // Product Master stock data, respecting any
  // availability of the inventory summary endpoint.

  const computedStock =
    productsList.reduce(
      (sum, product) =>
        sum + product.currentStock,
      0,
    );

  const computedValue =
    productsList.reduce(
      (sum, product) =>
        sum +
        (
          product.currentStock *
          product.sellingPrice
        ),
      0,
    );


  const lowStockItems =
    productsList.filter(
      (product) =>
        typeof product.reorderLevel ===
          "number" &&
        product.currentStock <=
          product.reorderLevel,
    );


  const warehouseSummaries: WarehouseSummary[] =
    warehousesList.map(
      (warehouse) => {

        const assignedProducts =
          productsList.filter(
            (product) =>
              product.warehouseIds?.includes(
                warehouse.id,
              ) ?? false,
          );

        const stockQuantity =
          assignedProducts.reduce(
            (sum, product) =>
              sum +
              product.currentStock,
            0,
          );

        return {
          id: warehouse.id,
          name: warehouse.name,
          productCount:
            assignedProducts.length,
          stockQuantity,
          status: warehouse.status,
        };
      },
    );


  const recentMovements =
    [...movements]
      .sort(
        (a, b) =>
          String(b.createdAt)
            .localeCompare(
              String(a.createdAt),
            ),
      )
      .slice(0, 8);


  const isLoading =
    productsLoading ||
    warehousesLoading ||
    movementsQuery.isLoading ||
    summaryQuery.isLoading;


  return {
    isLoading,

    totalProducts:
      productsList.length,

    totalStock:
      summary?.totalStock ??
      computedStock,

    inventoryValue:
      summary?.inventoryValue ??
      computedValue,

    lowStockCount:
      lowStockItems.length,

    summary,

    products: productsList,
    warehouses: warehousesList,

    lowStockItems,
    warehouseSummaries,
    recentMovements,
  };
}
