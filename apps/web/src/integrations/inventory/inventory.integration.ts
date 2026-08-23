/**
 * Inventory Integration — provides inventory information to other modules.
 *
 * This integration provides READ-ONLY access to inventory data.
 * Inventory module remains the owner of stock logic and mutations.
 * Other modules (POS, Sales, Service Desk, Purchase) consume this data.
 */

import { apiClient } from "../../api/client";

/** Stock availability for a product in a specific warehouse. */
export interface StockAvailability {
  productId: string;
  warehouseId: string;
  available: number;
  reserved: number;
  onHand: number;
  unitId?: string;
}

/** Product stock summary across all warehouses. */
export interface ProductStock {
  productId: string;
  productName: string;
  sku?: string;
  warehouses: StockAvailability[];
  totalOnHand: number;
  totalAvailable: number;
}

/** Lightweight stock reference for cross-module linking. */
export interface StockReference {
  productId: string;
  warehouseId: string;
  available: number;
}

/**
 * Get stock availability for a specific product in a specific warehouse.
 * Used by POS (checkout validation), Sales (order promising), Service Desk (parts check).
 */
export async function getStockAvailability(
  productId: string,
  warehouseId: string
): Promise<StockAvailability | null> {
  const response = await apiClient.get<StockAvailability>(
    `/inventory/stock/${productId}/${warehouseId}`
  );

  return response.data ?? null;
}

/**
 * Get product stock across all warehouses.
 * Used by POS (multi-location), Sales (available to promise), Reports.
 */
export async function getProductStock(productId: string): Promise<ProductStock | null> {
  const response = await apiClient.get<ProductStock>(
    `/inventory/products/${productId}/stock`
  );

  return response.data ?? null;
}

/**
 * Create a lightweight stock reference for cross-module linking.
 * Used by Sales (delivery line), Service Desk (parts request), POS (receipt).
 */
export function createStockReference(
  productId: string,
  warehouseId: string,
  available: number
): StockReference {
  return {
    productId,
    warehouseId,
    available,
  };
}

/**
 * Check if sufficient stock is available for a quantity.
 * Returns availability status and suggested alternative warehouse if short.
 */
export interface StockCheckResult {
  sufficient: boolean;
  available: number;
  requested: number;
  alternativeWarehouse?: {
    warehouseId: string;
    available: number;
  };
}

export async function checkStockAvailability(
  productId: string,
  warehouseId: string,
  quantity: number
): Promise<StockCheckResult> {
  const stock = await getStockAvailability(productId, warehouseId);

  if (!stock) {
    return {
      sufficient: false,
      available: 0,
      requested: quantity,
    };
  }

  if (stock.available >= quantity) {
    return {
      sufficient: true,
      available: stock.available,
      requested: quantity,
    };
  }

  // Could check other warehouses here in future
  return {
    sufficient: false,
    available: stock.available,
    requested: quantity,
  };
}