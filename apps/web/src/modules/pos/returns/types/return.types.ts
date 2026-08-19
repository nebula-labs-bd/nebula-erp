import type { POSPaymentMethod } from "../../types/transaction.types";

/**
 * POS Returns & Refunds domain types.
 *
 * POS is the *return interface* — it never owns return logic directly.
 * Returns flow through the existing Sales + Payments + Inventory + Accounting modules:
 *
 *   POS → Payments (refund + journal) → Accounting (adjustment)
 *       → Stock Movement (stock-in) → Inventory
 *
 * Inventory / stock / ledger are never touched directly here — the downstream
 * stock-in is created exclusively through the existing `createStockMovement`
 * service (the same path the Sales delivery flow uses for stock-out).
 */

/* ---------------------------------------------------------------- */
/* Return Item                                                       */
/* ---------------------------------------------------------------- */

/** A single line in a POS return. Mirrors the shape of SalesOrderItem so it maps
 * 1:1 onto the Sales module's return/credit-note flow. */
export interface POSReturnItem {
  /** Original sales order item id (for traceability). */
  salesOrderItemId: string;

  productId: string;

  /** Quantity being returned. */
  quantity: number;

  /** Per-unit price at time of original sale. */
  price: number;

  discount: number;

  tax: number;

  /** Line subtotal: (price * quantity) - discount + tax. */
  subtotal: number;

  /** Human-readable product name for display. */
  productName?: string;

  /** Product SKU for display. */
  sku?: string;
}

/* ---------------------------------------------------------------- */
/* Return Transaction                                                */
/* ---------------------------------------------------------------- */

/** Status lifecycle of a POS return. */
export type POSReturnStatus = "pending" | "completed" | "failed";

/** The assembled POS return ready to be handed to the Sales module.
 * This is the output shape the POS return service produces before creating
 * a Sales return / credit note. */
export interface POSReturn {
  /** Original sales order id this return references. */
  salesOrderId: string;

  /** Original sales order number for display. */
  salesOrderNumber: string;

  customerId: string;

  /** Warehouse the goods are returned to. Required for the return delivery
   * + stock-movement step so inventory can be increased through the proper
   * Sales return delivery flow. */
  warehouseId: string;

  /** Id of the cashier shift this return belongs to (POS register metadata). */
  shiftId?: string;

  items: POSReturnItem[];

  subtotal: number;

  discount: number;

  total: number;

  tax: number;

  /** Reason for the return (customer-facing). */
  reason: string;

  /** Internal notes for the return. */
  notes?: string;

  status: POSReturnStatus;
}

/* ---------------------------------------------------------------- */
/* Refund Payment                                                    */
/* ---------------------------------------------------------------- */

/** A single refund tender made against a POS return. Mirrors `POSPayment`
 * but for the outbound refund direction. */
export interface POSRefundPayment {
  /** Client-side id for the refund tender line. */
  id: string;

  method: POSPaymentMethod;

  amount: number;

  /** Optional transaction reference (card auth, mobile wallet txn id, etc.). */
  reference?: string;
}

/* ---------------------------------------------------------------- */
/* Service Result Shapes                                             */
/* ---------------------------------------------------------------- */

/** Status of the downstream inventory flow for a POS return.
 * - `pending`  — return delivery/stock movement not yet created.
 * - `completed`— return delivery created and full stock-in movements posted.
 * - `partial`  — return delivery created but only some lines' stock was increased.
 * - `failed`   — return + refund recorded, but the delivery/stock step could
 *                not be completed. The recorded return remains the source of
 *                truth and must be fulfilled manually. */
export type ReturnStockMovementStatus =
  | "pending"
  | "completed"
  | "partial"
  | "failed";

export interface POSReturnResult {
  returnDoc: POSReturn;

  /** Sales credit note / return order created. */
  salesReturn: {
    id: string;
    documentNumber: string;
    date: string;
    total: number;
    status: string;
  };

  /** Refund payments posted through the Payment module (which triggers
   * accounting journal). */
  refundPayments: {
    id: string;
    amount: number;
    method: POSPaymentMethod;
    reference?: string;
  }[];

  /** Id of the Sales return delivery created (empty if the delivery/stock
   * step failed). */
  deliveryId: string;

  /** Status of the downstream inventory (stock-in) flow. */
  stockMovementStatus: ReturnStockMovementStatus;

  /** Non-fatal warning (e.g. delivery/stock failed after a successful
   * return). When set, the recorded return + refund remain the source of
   * truth and the warehouse fulfilment must be completed manually. */
  warning?: string;

  /** Id of the cashier shift this return was recorded against (POS register
   * metadata only). */
  shiftId?: string;
}

/* ---------------------------------------------------------------- */
/* Input Shapes                                                      */
/* ---------------------------------------------------------------- */

export interface CreatePOSReturnInput {
  salesOrderId: string;
  customerId: string;
  warehouseId: string;
  items: {
    salesOrderItemId: string;
    productId: string;
    quantity: number;
    price: number;
    discount: number;
    tax: number;
    subtotal: number;
  }[];
  reason: string;
  notes?: string;
  shiftId?: string;
}