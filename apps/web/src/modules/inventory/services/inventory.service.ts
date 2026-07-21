import { apiClient } from "../../../api/client";

import type {
  Product,
  InventorySummary,
  CreateProductInput,
  UpdateProductInput,
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


export function createProduct(
  data: CreateProductInput,
) {
  return apiClient.post<Product>(
    "/inventory/products",
    data,
  );
}


export function updateProduct(
  data: UpdateProductInput,
) {
  return apiClient.post<Product>(
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