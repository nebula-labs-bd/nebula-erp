import { apiClient } from "../../../api/client";
import { endpoints } from "../../../api/endpoints";

import type {
  Product,
  InventorySummary,
} from "../types/inventory.types";


export function getProducts() {
  return apiClient.get<Product[]>(
    endpoints.inventory.products,
  );
}


export function getInventorySummary() {
  return apiClient.get<InventorySummary>(
    "/inventory/summary",
  );
}