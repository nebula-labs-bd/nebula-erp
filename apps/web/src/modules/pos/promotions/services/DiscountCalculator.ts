/**
 * POS Discount Calculator.
 *
 * Pure, framework-free functions that compute line- and invoice-level
 * discounts from cart data. Discounts never mutate inventory or accounting —
 * they only adjust the cart's per-line discount and the overall totals, which
 * are then recorded by the Sales module when the sale is created.
 *
 * Rules:
 *  - A line discount is capped at the line's (price * quantity) so it can
 *    never drive a line negative.
 *  - An invoice-level discount is capped at the pre-discount subtotal.
 *  - Tax is computed on the discounted line amount (subtotal after discount).
 */

import type { Cart, CartItem } from "../../types/pos.types";

import type {
  DiscountResult,
  POSDiscount,
  POSPromotion,
} from "../types/discount.types";

/* ---------------------------------------------------------------- */
/* Helpers                                                           */
/* ---------------------------------------------------------------- */

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

function lineGross(item: CartItem): number {
  return item.unitPrice * item.quantity;
}

/* ---------------------------------------------------------------- */
/* Apply discounts                                                   */
/* ---------------------------------------------------------------- */

/**
 * Apply a list of discounts (line + invoice) to a cart and return the
 * recomputed cart plus the total discount amount.
 */
export function applyDiscounts(
  cart: Cart,
  discounts: POSDiscount[],
): DiscountResult {
  const lineDiscountMap = new Map<string, number>();

  /* 1. Aggregate line-level discounts per line. */
  for (const d of discounts.filter((x) => x.scope === "line" && x.lineId)) {
    const gross = cart.items.find((i) => i.id === d.lineId)
      ? lineGross(cart.items.find((i) => i.id === d.lineId)!)
      : 0;
    const amount =
      d.type === "percentage"
        ? round2((gross * d.value) / 100)
        : d.value;
    lineDiscountMap.set(
      d.lineId!,
      round2((lineDiscountMap.get(d.lineId!) ?? 0) + amount),
    );
  }

  /* 2. Recompute each line with its capped discount + redistributed tax. */
  const items: CartItem[] = cart.items.map((item) => {
    const gross = lineGross(item);
    const rawDisc = lineDiscountMap.get(item.id) ?? 0;
    const disc = Math.min(rawDisc, gross); // cap at line gross

    const discountedGross = gross - disc;
    const tax = item.tax > 0 && gross > 0
      ? round2((discountedGross / gross) * item.tax)
      : 0;

    return {
      ...item,
      discount: round2(disc),
      tax,
      subtotal: round2(discountedGross + tax),
    };
  });

  /* 3. Subtotal + sum of line discounts. */
  const subtotal = round2(items.reduce((s, i) => s + lineGross(i), 0));
  const lineDiscountSum = round2(
    items.reduce((s, i) => s + i.discount, 0),
  );
  const tax = round2(items.reduce((s, i) => s + i.tax, 0));

  /* 4. Invoice-level discount, capped at remaining subtotal after line
   *    discounts. */
  const invoiceDiscounts = discounts.filter((x) => x.scope === "invoice");
  let invoiceDiscount = 0;
  for (const d of invoiceDiscounts) {
    const amount =
      d.type === "percentage"
        ? round2((subtotal * d.value) / 100)
        : d.value;
    invoiceDiscount = round2(invoiceDiscount + amount);
  }
  invoiceDiscount = Math.min(invoiceDiscount, Math.max(0, subtotal - lineDiscountSum));

  const totalDiscount = round2(lineDiscountSum + invoiceDiscount);
  const total = round2(subtotal - totalDiscount + tax);

  return {
    cart: {
      items,
      subtotal,
      discount: totalDiscount,
      tax,
      total,
    },
    totalDiscount,
  };
}

/* ---------------------------------------------------------------- */
/* Promotions                                                        */
/* ---------------------------------------------------------------- */

/**
 * Evaluate configured promotions against a cart and return the matching
 * discount entries. Pure: no side effects, no module calls.
 */
export function evaluatePromotions(
  cart: Cart,
  promotions: POSPromotion[],
): POSDiscount[] {
  const result: POSDiscount[] = [];
  const subtotal = cart.items.reduce(
    (s, i) => s + lineGross(i),
    0,
  );

  for (const promo of promotions) {
    if (promo.minSubtotal && subtotal < promo.minSubtotal) continue;

    if (promo.scope === "line" && promo.productIds?.length) {
      for (const item of cart.items) {
        if (promo.productIds.includes(item.productId)) {
          result.push({
            id: `${promo.code}-${item.id}`,
            type: promo.type,
            value: promo.value,
            scope: "line",
            lineId: item.id,
            label: promo.label,
          });
        }
      }
    } else {
      result.push({
        id: promo.code,
        type: promo.type,
        value: promo.value,
        scope: promo.scope,
        label: promo.label,
      });
    }
  }

  return result;
}
