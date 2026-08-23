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
  createSalesOrder,
  createDelivery,
  createDeliveryWithStockMovements,
} from "../../sales/services/sales.service";

import {
  mapPOSTransactionToSales,
} from "integrations/sales";

import type {
  CreatePaymentInput,
  Payment,
} from "../../payments/types/payment.types";

import type {
  CreateDeliveryInput,
  CreateSalesOrderInput,
  Delivery,
  SalesOrder,
  SalesOrderItem,
} from "../../sales/types/sales.types";

import type { Cart, POSTransactionInput, POSCustomer } from "../types/pos.types";
import type {
  POSPayment,
  StockMovementStatus,
} from "../types/transaction.types";
export interface POSTransactionResult {
  transaction: POSTransactionInput;
  salesOrder: SalesOrder;
  payments: Payment[];
  deliveryId: string;
  stockMovementStatus: StockMovementStatus;
  warning?: string;
  shiftId?: string;
}

const DEFAULT_UNIT_ID = "default";

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
): POSTransactionInput {
  const items = cart.items.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
    price: item.unitPrice,
    discount: item.discount,
    tax: item.tax,
    subtotal: item.subtotal,
  }));

  return {
    customer:
      customer ?? { id: "", customerId: "", name: "Walk-in Customer" },
    warehouseId,
    items: items.map((item) => ({
      product: { productId: item.productId, name: "", sellingPrice: item.price },
      quantity: item.quantity,
      price: item.price,
      discount: item.discount,
      tax: item.tax,
    })),
    subtotal: cart.subtotal,
    discount: cart.discount,
    tax: cart.tax,
    total: cart.total,
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
      error: "A customer is required to complete the sale.",
    };
  }

  if (!warehouseId) {
    return {
      valid: false,
      error: "Select a fulfilment warehouse.",
    };
  }

  const totalTendered = payments.reduce((sum, p) => sum + p.amount, 0);
  if (totalTendered < cart.total - 0.005) {
    return {
      valid: false,
      error: `Tendered ${totalTendered.toFixed(2)} < total ${cart.total.toFixed(2)}.`,
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
  transaction: POSTransactionInput,
): CreateSalesOrderInput {
  // Use the integration layer mapping
  const salesInput = mapPOSTransactionToSales(transaction);

  return {
    customerId: salesInput.customerId,
    orderNumber: `POS-${Date.now()}`,
    date: new Date().toISOString().split("T")[0],
    status: "confirmed" as const,
    items: salesInput.items.map((item: typeof salesInput.items[0]) => ({
      id: `pos-item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      productId: item.productId,
      quantity: item.quantity,
      unitId: item.unitId ?? DEFAULT_UNIT_ID,
      sellingPrice: item.unitPrice,
      tax: item.tax,
      discount: item.discount,
      total: item.unitPrice * item.quantity - item.discount + item.tax,
    })),
    subtotal: salesInput.items.reduce((sum: number, item: typeof salesInput.items[0]) => sum + item.unitPrice * item.quantity, 0),
    tax: salesInput.items.reduce((sum: number, item: typeof salesInput.items[0]) => sum + item.tax, 0),
    discount: salesInput.items.reduce((sum: number, item: typeof salesInput.items[0]) => sum + item.discount, 0),
    total: salesInput.items.reduce((sum: number, item: typeof salesInput.items[0]) => sum + item.unitPrice * item.quantity - item.discount + item.tax, 0),
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
    reference: payment.reference ?? "",
    date: new Date().toISOString().split("T")[0],
    note: `POS payment (${payment.method})`,
    status: "completed",
  };
}

/** Build the Delivery input from the POS transaction. Full delivery: every
 * cart line is delivered in full from the selected warehouse. Delegates
 * ownership of fulfilment to the Sales delivery flow (which then drives the
 * stock movement). */
function toDeliveryInput(
  transaction: POSTransactionInput,
  salesOrderId: string,
  salesOrderItems: SalesOrderItem[],
): CreateDeliveryInput {
  return {
    salesOrderId,
    warehouseId: transaction.warehouseId,
    date: new Date().toISOString(),
    items: salesOrderItems.map((soItem, index) => {
      const txItem = transaction.items.find((i) => i.product.productId === soItem.productId);
      return {
        id: `pos-delivery-item-${index + 1}`,
        productId: soItem.productId,
        productName: soItem.productId,
        unitId: soItem.unitId,
        orderedQuantity: txItem?.quantity ?? soItem.quantity,
        deliveredQuantity: txItem?.quantity ?? soItem.quantity,
        baseQuantity: txItem?.quantity ?? soItem.quantity,
      };
    }),
    status: "delivered" as const,
  };
}

/*\n *   4. Create a Sales delivery for the order.
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
      toPaymentInput(payment, safeCustomer.customerId),
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


