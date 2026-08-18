/**
 * POS transaction service.
 *
 * Bridge between the POS checkout interface and existing ERP modules.
 * Does NOT duplicate business logic — it maps the cart onto Sales,
 * posts payments via the existing Payment service (which triggers
 * accounting), and returns the result for the receipt.
 *
 *   POS → Sales (order) → Payments (tender + journal) → Accounting
 *
 * Inventory / stock / ledger are never touched here.
 */

import {
  createPaymentWithJournal,
} from "../../payments/services/payment.service";

import {
  createSalesOrder,
} from "../../sales/services/sales.service";

import type {
  CreatePaymentInput,
  Payment,
} from "../../payments/types/payment.types";

import type {
  CreateSalesOrderInput,
  SalesOrder,
  SalesOrderItem,
} from "../../sales/types/sales.types";

import type { Cart, POSCustomer } from "../types/pos.types";
import type {
  POSPayment,
  POSTransaction,
  POSTransactionItem,
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
    items,
    subtotal: cart.subtotal,
    discount: cart.discount,
    tax: cart.tax,
    total: cart.total,
    paymentStatus: "paid",
  };
}

/* ---------------------------------------------------------------- */
/* Validation                                                       */
/* ---------------------------------------------------------------- */

export interface POSTransactionValidation {
  valid: boolean;
  error?: string;
}

/** Guard the cart + customer + tenders before any mutation. */
export function validatePOSTransaction(
  cart: Cart,
  customer: POSCustomer | null,
  payments: POSPayment[],
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

/* ---------------------------------------------------------------- */
/* Transaction creation                                             */
/* ---------------------------------------------------------------- */

export interface POSTransactionResult {
  transaction: POSTransaction;
  salesOrder: SalesOrder;
  payments: Payment[];
}

/**
 * Create a real POS sale via the existing modules.
 *
 * Flow:
 *   1. Validate cart + customer + tenders.
 *   2. Create the Sales order (source of truth for the sale).
 *   3. Post each payment through `createPaymentWithJournal` — the existing
 *      Payment service, which automatically triggers the accounting journal.
 *   4. Return the assembled result for the receipt.
 */
export async function createPOSTransaction(
  cart: Cart,
  customer: POSCustomer | null,
  payments: POSPayment[],
): Promise<POSTransactionResult> {
  const validation = validatePOSTransaction(cart, customer, payments);

  if (!validation.valid) {
    throw new Error(validation.error ?? "Invalid POS transaction.");
  }

  // `customer` is guaranteed non-null after validation.
  const safeCustomer = customer as POSCustomer;

  const transaction = cartToTransaction(cart, safeCustomer);

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

  return {
    transaction,
    salesOrder,
    payments: createdPayments,
  };
}
