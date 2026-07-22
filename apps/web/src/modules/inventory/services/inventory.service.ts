import { apiClient } from "../../../api/client";

import type {
  ProductMaster,
  CreateProductMasterInput,
} from "../types/product.types";

import type {
  InventorySummary,
  StockMovement,
  CreateStockMovementInput,
  Warehouse,
  CreateWarehouseInput,
  StockLedgerEntry,
} from "../types/inventory.types";


export function getProducts() {
  return apiClient.get<ProductMaster[]>(
    "/inventory/products",
  );
}

export function getInventorySummary() {
  return apiClient.get<InventorySummary>(
    "/inventory/summary",
  );
}

export function createProduct(
  data: CreateProductMasterInput,
) {
  return apiClient.post<ProductMaster>(
    "/inventory/products",
    data,
  );
}


export function updateProduct(
  data: ProductMaster,
) {
  return apiClient.post<ProductMaster>(
    `/inventory/products/${data.id}`,
    data,
  );
}


export function deleteProduct(
  id: string,
) {
  return apiClient.post(
    `/inventory/products/${id}/delete`,
    {},
  );
}


export function getStockMovements() {
  return apiClient.get<StockMovement[]>(
    "/inventory/stock-movements",
  );
}


export function createStockMovement(
  data: CreateStockMovementInput,
) {
  return apiClient.post<StockMovement>(
    "/inventory/stock-movements",
    data,
  );
}


export function getWarehouses() {
  return apiClient.get<Warehouse[]>(
    "/inventory/warehouses",
  );
}


export function createWarehouse(
  data: CreateWarehouseInput,
) {
  return apiClient.post<Warehouse>(
    "/inventory/warehouses",
    data,
  );
}


export function getStockLedger() {
  return apiClient.get<StockLedgerEntry[]>(
    "/inventory/ledger",
  );
}