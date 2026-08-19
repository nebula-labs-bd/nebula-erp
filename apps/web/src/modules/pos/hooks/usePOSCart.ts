import { useCallback, useMemo, useState } from "react";

import type { Cart, CartItem } from "../types/pos.types";

/**
 * Minimal product shape accepted by `addProduct`. Derived from the Inventory
 * `ProductMaster` so the POS can reuse inventory data without duplicating the
 * product source of truth.
 */
export interface POSProductInput {
  id: string;

  name: string;

  sku: string;

  /** Optional barcode mirrored from the Product Master so a scanned product is
   * identifiable in the cart / receipt. POS never creates or stores products. */
  barcode?: string;

  sellingPrice: number;

  /** Optional tax rate (percentage). Defaults to 0 when absent. */
  taxRate?: number;
}

let cartLineSeq = 0;

function nextLineId(productId: string): string {
  cartLineSeq += 1;

  return `pos-line-${productId}-${cartLineSeq}`;
}

/** Build a fresh cart line from a product with quantity 1. */
function toCartItem(product: POSProductInput): CartItem {
  const quantity = 1;

  const discount = 0;

  const taxRate = product.taxRate ?? 0;

  const tax = (product.sellingPrice * quantity * taxRate) / 100;

  const subtotal =
    product.sellingPrice * quantity - discount + tax;

  return {
    id: nextLineId(product.id),

    productId: product.id,

    name: product.name,

    sku: product.sku,

    barcode: product.barcode,

    quantity,

    unitPrice: product.sellingPrice,

    discount,

    tax,

    subtotal,
  };
}

/**
 * Recompute the full cart (line subtotals + cart totals) from a list of items.
 *
 * This is the single source of cart math for the POS workspace. It keeps the
 * cart immutable and frontend-only — nothing here touches the API or Sales
 * logic. `tax`/`discount` are preserved on each item and only the derived
 * `subtotal` / `total` fields are recomputed.
 */
export function calculateTotals(
  items: CartItem[],
): Cart {
  return items.reduce<Cart>(
    (cart, item) => {
      const lineSubtotal =
        item.unitPrice * item.quantity -
        item.discount +
        item.tax;

      return {
        items: [
          ...cart.items,

          {
            ...item,

            subtotal: lineSubtotal,
          },
        ],

        subtotal: cart.subtotal + item.unitPrice * item.quantity,

        discount: cart.discount + item.discount,

        tax: cart.tax + item.tax,

        total:
          cart.total +
          (item.unitPrice * item.quantity -
            item.discount +
            item.tax),
      };
    },
    {
      items: [],

      subtotal: 0,

      discount: 0,

      tax: 0,

      total: 0,
    },
  );
}

/**
 * POS cart state hook.
 *
 * Manages the current transaction entirely in frontend React state. Provides
 * imperative cart operations plus a memoized view of the computed totals so
 * downstream components (cart, checkout) never recompute math themselves.
 */
export function usePOSCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  const addProduct = useCallback(
    (product: POSProductInput) => {
      setItems((prev) => {
        const existing = prev.find(
          (item) => item.productId === product.id,
        );

        if (existing) {
          return prev.map((item) =>
            item.productId === product.id
              ? {
                  ...item,

                  quantity: item.quantity + 1,
                }
              : item,
          );
        }

        return [...prev, toCartItem(product)];
      });
    },
    [],
  );

  const removeProduct = useCallback(
    (lineId: string) => {
      setItems((prev) =>
        prev.filter((item) => item.id !== lineId),
      );
    },
    [],
  );

  const updateQuantity = useCallback(
    (lineId: string, quantity: number) => {
      setItems((prev) => {
        if (quantity <= 0) {
          return prev.filter(
            (item) => item.id !== lineId,
          );
        }

        return prev.map((item) =>
          item.id === lineId
            ? {
                ...item,

                quantity,
              }
            : item,
        );
      });
    },
    [],
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // Replace the entire cart contents (used by the discount calculator which
  // returns a fully-recomputed set of lines). UI-state only — no business
  // logic; downstream totals are still derived by `calculateTotals`.
  const replaceCart = useCallback((next: CartItem[]) => {
    setItems(next);
  }, []);

  const cart = useMemo(
    () => calculateTotals(items),
    [items],
  );

  return {
    items: cart.items,

    cart,

    calculateTotals,

    addProduct,

    removeProduct,

    updateQuantity,

    clearCart,

    replaceCart,
  };
}
