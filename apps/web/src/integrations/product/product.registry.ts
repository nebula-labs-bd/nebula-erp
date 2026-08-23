/**
 * Product Registry — single access point for product data across modules.
 *
 * Any module needing products (Inventory, POS, Sales, Purchase, Service Parts)
 * uses this registry. It references core Product entities only —
 * it does NOT create or duplicate product data.
 */

import { apiClient } from "../../api/client";
import type { Product } from "core";

/** Lightweight search result shape for selectors. */
export interface ProductSearchResult {
  id: string;
  name: string;
  sku?: string;
  barcode?: string;
  sellingPrice?: number;
  status: "active" | "inactive" | "archived";
}

/**
 * Fetch a single product by ID.
 * Returns the core Product entity.
 */
export async function getProduct(id: string): Promise<Product | null> {
  const response = await apiClient.get<Product>(`/products/${id}`);
  return response.data ?? null;
}

/**
 * Search products by query string.
 * Returns lightweight results for dropdowns/selectors.
 */
export async function searchProducts(query: string): Promise<ProductSearchResult[]> {
  const response = await apiClient.get<Product[]>(
    `/products?q=${encodeURIComponent(query)}`
  );

  return (response.data ?? []).map((product): ProductSearchResult => ({
    id: product.id,
    name: product.name,
    sku: product.sku,
    barcode: product.barcode,
    sellingPrice: product.sellingPrice,
    status: product.status,
  }));
}

/**
 * Create a lightweight product reference for cross-module linking.
 * Used by POS, Sales, Service Desk to reference a product without embedding full data.
 */
export interface ProductReference {
  productId: string;
  name: string;
  sku?: string;
  sellingPrice?: number;
}

export function createProductReference(product: Product): ProductReference {
  return {
    productId: product.id,
    name: product.name,
    sku: product.sku,
    sellingPrice: product.sellingPrice,
  };
}

/**
 * Map a core Product to a module-specific shape.
 * Modules can extend this for their specific needs.
 */
export interface ModuleProduct {
  id: string;
  name: string;
  sku?: string;
  barcode?: string;
  categoryId?: string;
  brandId?: string;
  unitId?: string;
  sellingPrice?: number;
  status: "active" | "inactive" | "archived";
}

export function mapProductReference(product: Product): ModuleProduct {
  return {
    id: product.id,
    name: product.name,
    sku: product.sku,
    barcode: product.barcode,
    categoryId: product.categoryId,
    brandId: product.brandId,
    unitId: product.unitId,
    sellingPrice: product.sellingPrice,
    status: product.status,
  };
}