import { apiClient } from "../../../api/client";

import type {
  Product,
  InventorySummary,
} from "../types/inventory.types";


export function getProducts() {
  return apiClient.get<Product[]>(
    "/inventory/products",
  );
}


export function getInventorySummary() {
  return apiClient.get<InventorySummary>(
    "/inventory/summary",
  );
}