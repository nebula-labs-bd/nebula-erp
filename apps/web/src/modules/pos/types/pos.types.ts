/**
 * POS (Point of Sale) domain types.
 *
 * POS is a *selling interface* — it never owns sales logic. The cart is
 * frontend-only state used to assemble a sale before it is handed off to the
 * Sales module (the source of truth). These types deliberately mirror the
 * shapes of `SalesOrderItem` / `SalesOrder` so a future checkout can map
 * cleanly onto the existing Sales flow without duplicating it.
 */

import type { ProductReference } from "integrations";

/** A single line in the POS cart. */
export interface CartItem {
  /** Stable client-side id for the cart line. */
  id: string;

  productId: string;

  name: string;

  sku: string;

  /** Optional barcode carried from the Product Master for receipt display.
   * POS never owns barcode data — it mirrors the inventory source of truth. */
  barcode?: string;

  quantity: number;

  /** Per-unit selling price. */
  unitPrice: number;

  /** Line-level discount amount (in currency units). */
  discount: number;

  /** Line-level tax amount (in currency units). */
  tax: number;

  /** Line total: (unitPrice * quantity) - discount + tax. */
  subtotal: number;
}

/** The assembled cart with computed totals. */
export interface Cart {
  items: CartItem[];

  /** Sum of (unitPrice * quantity) across all items. */
  subtotal: number;

  /** Sum of item discounts. */
  discount: number;

  /** Sum of item taxes. */
  tax: number;

  /** subtotal - discount + tax. */
  total: number;
}

/**
 * Minimal customer slice used by the POS workspace.
 * Carries the resolved `id` (from the shared Contact/customer source of truth)
 * and a denormalised `customerId` for downstream Sales allocation, plus the
 * display fields the checkout UI needs. It references, never duplicates, the
 * customer source of truth.
 */
export interface POSCustomer {
  id: string;
  customerId: string;
  name: string;
  customerCode?: string;
  email?: string;
  phone?: string;
}

/**
 * POS transaction input mapped from cart.
 * Uses integration layer reference types for cross-module linking.
 */
export interface POSTransactionInput {
  customer: POSCustomer;
  warehouseId: string;
  items: Array<{
    product: ProductReference;
    quantity: number;
    price: number;
    discount: number;
    tax: number;
    unitId?: string;
  }>;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  shiftId?: string;
}
