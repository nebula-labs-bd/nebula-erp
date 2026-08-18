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

  /** Warehouse the goods are fulfilled from. Required for the delivery +
   * stock-movement step so inventory can be reduced through the proper
   * Sales → Delivery → Stock Movement flow (POS never touches inventory directly). */
  warehouseId: string;

  /** Id of the cashier shift this sale belongs to, used by POS register
   * reporting only. It is carried as POS operational metadata and is never
   * used to mutate accounting or inventory. */
  shiftId?: string;

  items: POSTransactionItem[];

  subtotal: number;

  discount: number;

  total: number;

  tax: number;

  /** "paid" when the sum of tenders covers the total, else "due". */
  paymentStatus: "paid" | "due";
}

/* ---------------------------------------------------------------- */
/* Stock movement status                                            */
/* ---------------------------------------------------------------- */

/** Status of the downstream inventory flow for a POS sale.
 *
 * - `pending`  — delivery/stock movement not yet created.
 * - `completed`— delivery created and full stock-out movements posted.
 * - `partial`  — delivery created but only some lines' stock was reduced
 *                (e.g. partial fulfilment).
 * - `failed`   — sale + payment recorded, but the delivery/stock step could
 *                not be completed. The recorded sale remains the source of
 *                truth and must be fulfilled manually.
 */
export type StockMovementStatus =
  | "pending"
  | "completed"
  | "partial"
  | "failed";
