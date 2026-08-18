/**
 * POS transaction + payment domain types.
 *
 * POS is the *checkout interface* only. These types describe the data the POS
 * assembles before handing the transaction off to the real source-of-truth
 * modules:
 *
 *   POS → Sales (sales order) → Payments (payment + journal) → Accounting
 *
 * `POSTransaction` / `POSTransactionItem` mirror the shapes of `SalesOrder` /
 * `SalesOrderItem` so the POS service can map cleanly onto the existing Sales
 * flow without duplicating it. `POSPayment` / `POSPaymentMethod` mirror the
 * existing payments `Payment` / `PaymentMethod` types so split payments can be
 * posted through the existing Payment service.
 */

import type { PaymentMethod } from "../../payments/types/payment.types";

/* ---------------------------------------------------------------- */
/* Payment                                                          */
/* ---------------------------------------------------------------- */

/** Payment methods supported at the POS register. Mirrors the existing
 * payments `PaymentMethod` union (with the bKash / Nagad / other variants
 * used by the POS). POS never redefines payment logic. */
export type POSPaymentMethod = PaymentMethod;

/** A single payment tender made against a POS sale. Multiple tenders make up a
 * split payment (e.g. Cash 4000 + bKash 6000). */
export interface POSPayment {
  /** Client-side id for the tender line. */
  id: string;

  method: POSPaymentMethod;

  amount: number;

  /** Optional transaction reference (card auth, mobile wallet txn id, etc.). */
  reference?: string;
}

/* ---------------------------------------------------------------- */
/* Transaction                                                      */
/* ---------------------------------------------------------------- */

/** A single line in a POS sale. Mirrors `SalesOrderItem` so it maps 1:1 onto
 * the Sales module. */
export interface POSTransactionItem {
  productId: string;

  quantity: number;

  /** Per-unit price. */
  price: number;

  discount: number;

  tax: number;

  subtotal: number;
}

/** The assembled POS sale ready to be handed to the Sales module. This is the
 * output shape the POS service produces before creating a Sales order. */
export interface POSTransaction {
  customerId: string;

  items: POSTransactionItem[];

  subtotal: number;

  discount: number;

  tax: number;

  total: number;

  /** "paid" when the sum of tenders covers the total, else "due". */
  paymentStatus: "paid" | "due";
}
