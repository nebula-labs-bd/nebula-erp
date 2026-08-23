/**
 * Product Mapper — transforms core Product entities to module-specific shapes.
 *
 * Provides consistent mapping for modules that need product data in
 * specific formats without duplicating the core entity.
 */

import type { Product } from "core";

/** POS-specific product shape (minimal for checkout). */
export interface POSProduct {
  id: string;
  name: string;
  sku?: string;
  barcode?: string;
  sellingPrice?: number;
  tax?: number | string;
}

/** Sales-specific product shape (for orders/deliveries). */
export interface SalesProduct {
  id: string;
  name: string;
  sku?: string;
  barcode?: string;
  unitId?: string;
  sellingPrice?: number;
  tax?: number | string;
}

/** Inventory-specific product shape (extended for stock). */
export interface InventoryProduct {
  id: string;
  name: string;
  sku?: string;
  barcode?: string;
  categoryId?: string;
  brandId?: string;
  unitId?: string;
  costPrice?: number;
  sellingPrice?: number;
  tax?: number | string;
  currentStock?: number;
  reorderLevel?: number;
}

/** Service Parts product shape (for service requests). */
export interface ServiceProduct {
  id: string;
  name: string;
  sku?: string;
  sellingPrice?: number;
  categoryId?: string;
}

/** Purchase product shape (for purchase orders). */
export interface PurchaseProduct {
  id: string;
  name: string;
  sku?: string;
  costPrice?: number;
  unitId?: string;
  categoryId?: string;
}

/** Map core Product to POS shape. */
export function toPOSProduct(product: Product): POSProduct {
  return {
    id: product.id,
    name: product.name,
    sku: product.sku,
    barcode: product.barcode,
    sellingPrice: product.sellingPrice,
    tax: product.tax,
  };
}

/** Map core Product to Sales shape. */
export function toSalesProduct(product: Product): SalesProduct {
  return {
    id: product.id,
    name: product.name,
    sku: product.sku,
    barcode: product.barcode,
    unitId: product.unitId,
    sellingPrice: product.sellingPrice,
    tax: product.tax,
  };
}

/** Map core Product to Inventory shape. */
export function toInventoryProduct(product: Product): InventoryProduct {
  return {
    id: product.id,
    name: product.name,
    sku: product.sku,
    barcode: product.barcode,
    categoryId: product.categoryId,
    brandId: product.brandId,
    unitId: product.unitId,
    costPrice: product.purchasePrice,
    sellingPrice: product.sellingPrice,
    tax: product.tax,
  };
}

/** Map core Product to Service Parts shape. */
export function toServiceProduct(product: Product): ServiceProduct {
  return {
    id: product.id,
    name: product.name,
    sku: product.sku,
    sellingPrice: product.sellingPrice,
    categoryId: product.categoryId,
  };
}

/** Map core Product to Purchase shape. */
export function toPurchaseProduct(product: Product): PurchaseProduct {
  return {
    id: product.id,
    name: product.name,
    sku: product.sku,
    costPrice: product.purchasePrice,
    unitId: product.unitId,
    categoryId: product.categoryId,
  };
}