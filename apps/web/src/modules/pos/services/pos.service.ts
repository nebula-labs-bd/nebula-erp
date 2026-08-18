/**
 * POS transaction service.
 *
 * Bridge between the POS checkout interface and existing ERP modules.
 * Does NOT duplicate business logic — it maps the cart onto Sales,
 * posts payments via the existing Payment service (which triggers
 * accounting), and returns the result for the receipt.
 *
 *   POS → Sales (order) → Payments (tender + journal) → Accounting
 *      → Sales Delivery → Stock Movement → Inventory
 *
 * Inventory / stock / ledger are never touched directly here — the downstream
 * stock-out is created exclusively through the existing Sales delivery flow
 * (`createDelivery` + `createDeliveryWithStockMovements`), which is the single
 * approved Sales → Delivery → Stock Movement → Inventory path.
 */

import {
  createPaymentWithJournal,
} from "../../payments/services/payment.service";

import {
  createDelivery,
  createDeliveryWithStockMovements,
  createSalesOrder,
} from "../../sales/services/sales.service";

import type {
  CreatePaymentInput,
  Payment,
} from "../../payments/types/payment.types";

import type {
  CreateDeliveryInput,
  CreateSalesOrderInput,
  Delivery,
  DeliveryItem,
  SalesOrder,
  SalesOrderItem,
} from "../../sales/types/sales.types";

import type { Cart, POSCustomer } from "../types/pos.types";
import type {
  POSPayment,
  POSTransaction,
  POSTransactionItem,
  StockMovementStatus,
} from "../types/transaction.types";

const DEFAULT_UNIT_ID = "default";

function generateOrderNumber(): string {
  const d = new Date();
  return `POS-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}-${Date.now()}`;
}

/* ---------------------------------------------------------------- */
/* Cart → POSTransaction                                            */
/* ---------------------------------------------------------------- */

/** Map the frontend-only cart onto the POS transaction shape. Pure transform;
 * mirrors `SalesOrder` totals so the downstream mapping is direct. */
export function cartToTransaction(
  cart: Cart,
  customer: POSCustomer | null,
  warehouseId: string,
  shiftId?: string,
): POSTransaction {
  const items: POSTransactionItem[] = cart.items.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
    price: item.unitPrice,
    discount: item.discount,
    tax: item.tax,
    subtotal: item.subtotal,
  }));

  return {
    customerId: customer?.id ?? "",
    warehouseId,
    items,
    subtotal: cart.subtotal,
    discount: cart.discount,
    tax: cart.tax,
    total: cart.total,
    paymentStatus: "paid",
    shiftId,
  };
}

/* ---------------------------------------------------------------- */
/* Validation                                                       */
/* ---------------------------------------------------------------- */

export interface POSTransactionValidation {
  valid: boolean;
  error?: string;
}

/** Guard the cart + customer + warehouse + tenders before any mutation. */
export function validatePOSTransaction(
  cart: Cart,
  customer: POSCustomer | null,
  payments: POSPayment[],
  warehouseId: string,
): POSTransactionValidation {
  if (cart.items.length === 0) {
    return { valid: false, error: "Cart is empty." };
  }

  if (!customer) {
    return {
      valid: false,
      error: "A customer (or walk-in) must be selected.",
    };
  }

  if (!warehouseId) {
    return {
      valid: false,
      error: "A warehouse must be selected to fulfil the sale.",
    };
  }

  if (payments.length === 0) {
    return { valid: false, error: "No payment entered." };
  }

  const totalTendered = payments.reduce(
    (sum, payment) => sum + payment.amount,
    0,
  );

  if (totalTendered < cart.total - 0.001) {
    return {
      valid: false,
      error: `Amount tendered (${totalTendered}) is less than the total (${cart.total}).`,
    };
  }

  return { valid: true };
}

/* ---------------------------------------------------------------- */
/* Mappers                                                          */
/* ---------------------------------------------------------------- */

/** Build the Sales order input from the POS transaction. Delegates ownership of
 * the sale to the Sales module. */
function toSalesOrderInput(
  transaction: POSTransaction,
): CreateSalesOrderInput {
  const items: SalesOrderItem[] = transaction.items.map(
    (item, index) => ({
      id: `pos-item-${index + 1}`,
      productId: item.productId,
      unitId: DEFAULT_UNIT_ID,
      quantity: item.quantity,
      sellingPrice: item.price,
      tax: item.tax,
      discount: item.discount,
      total: item.subtotal,
    }),
  );

  return {
    customerId: transaction.customerId,
    orderNumber: generateOrderNumber(),
    date: new Date().toISOString().split("T")[0],
    status: "confirmed",
    items,
    subtotal: transaction.subtotal,
    tax: transaction.tax,
    discount: transaction.discount,
    total: transaction.total,
  };
}

/** Build a receivable payment input from a POS tender. Each tender is a
 * customer payment (receivable) settled at the register. */
function toPaymentInput(
  payment: POSPayment,
  customerId: string,
): CreatePaymentInput {
  return {
    type: "receivable",
    partyId: customerId,
    amount: payment.amount,
    method: payment.method,
    date: new Date().toISOString().split("T")[0],
    reference: payment.reference ?? "",
    note: `POS payment (${payment.method})`,
    status: "completed",
  } satisfies CreatePaymentInput;
}

/** Build the Delivery input from the POS transaction. Full delivery: every
 * cart line is delivered in full from the selected warehouse. Delegates
 * ownership of fulfilment to the Sales delivery flow (which then drives the
 * stock movement). */
function toDeliveryInput(
  transaction: POSTransaction,
  salesOrderId: string,
  salesOrderItems: SalesOrderItem[],
): CreateDeliveryInput {
  const items: DeliveryItem[] = transaction.items.map((item, index) => {
    const soItem = salesOrderItems[index];

    return {
      id: `pos-delivery-item-${index + 1}`,
      productId: item.productId,
      productName: soItem?.productId ?? item.productId,
      unitId: soItem?.unitId ?? DEFAULT_UNIT_ID,
      orderedQuantity: item.quantity,
      deliveredQuantity: item.quantity,
      baseQuantity: item.quantity,
    };
  });

  return {
    salesOrderId,
    warehouseId: transaction.warehouseId,
    date: new Date().toISOString().split("T")[0],
    items,
    status: "delivered",
  };
}

/* ---------------------------------------------------------------- */
/* Transaction creation                                             */
/* ---------------------------------------------------------------- */

export interface POSTransactionResult {
  transaction: POSTransaction;
  salesOrder: SalesOrder;
  payments: Payment[];
  /** Id of the Sales delivery created for this POS sale (empty if the
   * delivery/stock step failed). */
  deliveryId: string;
  /** Status of the downstream inventory (stock-out) flow. */
  stockMovementStatus: StockMovementStatus;
  /** Non-fatal warning (e.g. delivery/stock failed after a successful sale).
   * When set, the recorded sale + payment remain the source of truth and the
   * warehouse fulfilment must be completed manually. */
  warning?: string;

  /** Id of the cashier shift this sale was recorded against (POS register
   * metadata only). */
  shiftId?: string;
}

/**
 * Create a real POS sale via the existing modules.
 *
 * Flow:
 *   1. Validate cart + customer + warehouse + tenders.
 *   2. Create the Sales order (source of truth for the sale).
 *   3. Post each payment through `createPaymentWithJournal` — the existing
 *      Payment service, which automatically triggers the accounting journal.
 *   4. Create a Sales delivery for the order.
 *   5. Drive the stock-out via `createDeliveryWithStockMovements` — the
 *      existing Sales → Delivery → Stock Movement flow. Inventory is reduced
 *      only through this movement; POS never mutates inventory directly.
 *
 * The delivery/stock step is *best-effort*: if it fails after the sale + payment
 * are already recorded, the error is surfaced as a `warning` rather than
 * aborting the transaction — the recorded sale is the source of truth and stays
 * intact. A partial stock update is reported via `stockMovementStatus`.
 */
export async function createPOSTransaction(
  cart: Cart,
  customer: POSCustomer | null,
  payments: POSPayment[],
  warehouseId: string,
  shiftId?: string,
): Promise<POSTransactionResult> {
  const validation = validatePOSTransaction(
    cart,
    customer,
    payments,
    warehouseId,
  );

  if (!validation.valid) {
    throw new Error(validation.error ?? "Invalid POS transaction.");
  }

  // `customer` is guaranteed non-null after validation.
  const safeCustomer = customer as POSCustomer;

  const transaction = cartToTransaction(cart, safeCustomer, warehouseId, shiftId);

  const orderResponse = await createSalesOrder(
    toSalesOrderInput(transaction),
  );

  const salesOrder = orderResponse.data;

  const createdPayments: Payment[] = [];

  for (const payment of payments) {
    const response = await createPaymentWithJournal(
      toPaymentInput(payment, safeCustomer.id),
    );

    createdPayments.push(response.data);
  }

  // --- Delivery + Stock Movement (best-effort) ---
  // The sale + payment are now recorded. The delivery/stock step must never
  // throw away that work, so it is wrapped and surfaced as a warning.
  let deliveryId = "";
  let stockMovementStatus: StockMovementStatus = "pending";
  let warning: string | undefined;

  try {
    const deliveryResponse = await createDelivery(
      toDeliveryInput(transaction, salesOrder.id, salesOrder.items),
    );

    const delivery: Delivery = deliveryResponse.data;

    deliveryId = delivery.id;

    await createDeliveryWithStockMovements(delivery);

    stockMovementStatus = "completed";
  } catch (stockErr) {
    stockMovementStatus = "failed";

    warning =
      stockErr instanceof Error
        ? `Sale recorded, but stock could not be deducted: ${stockErr.message}. ` +
          `Complete the delivery manually for SO ${salesOrder.orderNumber}.`
        : `Sale recorded, but stock could not be deducted for SO ${salesOrder.orderNumber}. ` +
          `Complete the delivery manually.`;
  }

  return {
    transaction,
    salesOrder,
    payments: createdPayments,
    deliveryId,
    stockMovementStatus,
    warning,
    shiftId,
  };
}
