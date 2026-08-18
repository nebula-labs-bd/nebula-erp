/**
 * POS (Point of Sale) domain types.
 *
 * POS is a *selling interface* — it never owns sales logic. The cart is
 * frontend-only state used to assemble a sale before it is handed off to the
 * Sales module (the source of truth). These types deliberately mirror the
 * shapes of `SalesOrderItem` / `SalesOrder` so a future checkout can map
 * cleanly onto the existing Sales flow without duplicating it.
 */

/** A single line in the POS cart. */
export interface CartItem {
  /** Stable client-side id for the cart line. */
  id: string;

  productId: string;

  name: string;

  sku: string;

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
 * Minimal customer slice used by the POS workspace. Mapped from the existing
 * Sales `Customer` / Contacts `Contact` records so we reuse, not duplicate,
 * the customer source of truth.
 */
export interface POSCustomer {
  id: string;

  name: string;

  phone: string;
}
