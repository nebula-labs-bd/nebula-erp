/**
 * POS Discount / Promotion domain types.
 *
 * POS is the *pricing interface* — it never owns discount logic. Discounts
 * adjust the cart total before it is handed to the Sales module, where the
 * discounted amounts are recorded as part of the sales order. Discounts are
 * computed purely from cart data here; the applied amounts flow downstream
 * through the existing Sales → Payments → Accounting path.
 */

import type { Cart } from "../../types/pos.types";

/* ---------------------------------------------------------------- */
/* Discount types                                                    */
/* ---------------------------------------------------------------- */

/** Kind of discount applied. */
export type DiscountType = "percentage" | "fixed";

/** Scope of a discount. */
export type DiscountScope = "line" | "invoice";

/** A single discount (manual or promo-driven) applied at the POS. */
export interface POSDiscount {
  id: string;

  type: DiscountType;

  /** For `percentage`, the percent value (e.g. 10 == 10%). For `fixed`, the
   * currency amount (capped at the target subtotal). */
  value: number;

  scope: DiscountScope;

  /** Target line id when `scope === "line"`. Omitted for invoice-level. */
  lineId?: string;

  /** Human-readable label (e.g. "Staff 10%", "Promo WEEKEND20"). */
  label: string;
}

/* ---------------------------------------------------------------- */
/* Promotion rules                                                   */
/* ---------------------------------------------------------------- */

/** A configured promotion evaluated against the cart. */
export interface POSPromotion {
  id: string;

  code: string;

  label: string;

  type: DiscountType;

  value: number;

  scope: DiscountScope;

  /** Optional minimum subtotal (currency) required to trigger the promo. */
  minSubtotal?: number;

  /** Optional list of product ids the promo applies to (line scope). */
  productIds?: string[];
}

/* ---------------------------------------------------------------- */
/* Computed result                                                   */
/* ---------------------------------------------------------------- */

export interface DiscountResult {
  /** Updated cart with discount/tax/subtotal recomputed per item + totals. */
  cart: Cart;

  /** Total discount applied across the cart (currency). */
  totalDiscount: number;
}
