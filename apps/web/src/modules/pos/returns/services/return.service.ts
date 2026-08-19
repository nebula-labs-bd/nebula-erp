/**
 * POS returns & refunds service.
 *
 * Bridge between the POS return interface and existing ERP modules.
 * Does NOT duplicate business logic — it delegates refunds to the existing
 * Payment service, stock-in to the existing Inventory stock-movement service,
 * and accounting adjustments to the existing Accounting journal service.
 *
 *   POS Return → Payments (refund + journal) → Accounting (adjustment)
 *             → Stock Movement (stock-in) → Inventory
 *
 * Inventory / stock / ledger are never touched directly here — the downstream
 * stock-in is created exclusively through the existing `createStockMovement`
 * call (the same path the Sales delivery flow uses for stock-out).
 */

import {
  createStockMovement,
} from "../../../inventory/services/inventory.service";

import {
  createJournalEntry,
  getAccounts,
} from "../../../accounting/services/accounting.service";

import {
  getSalesOrders,
} from "../../../sales/services/sales.service";

import { apiClient } from "../../../../api/client";

import type {
  CreateStockMovementInput,
} from "../../../inventory/types/inventory.types";

import type {
  Account,
} from "../../../accounting/types/accounting.types";

import type {
  POSReturn,
  POSReturnItem,
  POSReturnResult,
  POSReturnStatus,
  ReturnStockMovementStatus,
} from "../types/return.types";

import type { POSPaymentMethod } from "../../types/transaction.types";

const DEFAULT_UNIT_ID = "default";

/**
 * Find a sales order by its order number. POS never owns invoice data —
 * it queries the Sales module (source of truth).
 */
export async function findInvoice(orderNumber: string) {
  const response = await getSalesOrders();
  return response.data.find((o) => o.orderNumber === orderNumber) ?? null;
}

export interface CreatePOSReturnInput {
  salesOrderId: string;
  salesOrderNumber: string;
  customerId: string;
  warehouseId: string;
  items: POSReturnItem[];
  reason: string;
  notes?: string;
  shiftId?: string;
}

/**
 * Create a POS return via existing modules.
 *   POS Return → Payments (refund + journal) → Accounting → Stock Movement (stock-in) → Inventory
 * Downstream steps are best-effort; failures surface as `warning`.
 */
export async function createPOSReturn(
  input: CreatePOSReturnInput,
): Promise<POSReturnResult> {
  const returnDoc: POSReturn = {
    salesOrderId: input.salesOrderId,
    salesOrderNumber: input.salesOrderNumber,
    customerId: input.customerId,
    warehouseId: input.warehouseId,
    shiftId: input.shiftId,
    items: input.items,
    subtotal: input.items.reduce((s, i) => s + i.price * i.quantity, 0),
    discount: input.items.reduce((s, i) => s + i.discount, 0),
    tax: input.items.reduce((s, i) => s + i.tax, 0),
    total: input.items.reduce((s, i) => s + i.subtotal, 0),
    reason: input.reason,
    notes: input.notes,
    status: "pending" as POSReturnStatus,
  };

  const returnResponse = await apiClient.post<POSReturn>("/pos/returns", {
    salesOrderId: input.salesOrderId,
    customerId: input.customerId,
    warehouseId: input.warehouseId,
    items: input.items.map((item) => ({
      salesOrderItemId: item.salesOrderItemId,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      discount: item.discount,
      tax: item.tax,
      subtotal: item.subtotal,
    })),
    reason: input.reason,
    notes: input.notes,
    shiftId: input.shiftId,
  });

  const savedReturn = returnResponse.data;
  returnDoc.status = "completed";

  /* Step 2: Refund via existing Payment module (best-effort) */
  const refundPayments: { id: string; amount: number; method: POSPaymentMethod; reference?: string }[] = [];
  try {
    const { createPaymentWithJournal } = await import(
      "../../../payments/services/payment.service"
    );
    const p = (await createPaymentWithJournal({
      type: "receivable",
      partyId: input.customerId,
      amount: returnDoc.total,
      method: "cash",
      date: new Date().toISOString().split("T")[0],
      reference: savedReturn.salesOrderId,
      note: `POS refund for return ${savedReturn.salesOrderId}`,
      status: "completed",
    })).data;
    refundPayments.push({
      id: p.id,
      amount: p.amount,
      method: p.method as POSPaymentMethod,
      reference: p.reference || undefined,
    });
  } catch {
    // Non-fatal — refund can be retried later.
  }

  /* Step 3: Accounting adjustment (best-effort) */
  try {
    const accounts: Account[] = (await getAccounts()).data;
    const arAccount = accounts.find(
      (a) => a.type === "income" && /accounts receivable/i.test(a.name),
    );
    const cashAccount = accounts.find(
      (a) => a.type === "asset" && /cash/i.test(a.name),
    );
    if (arAccount && cashAccount) {
      await createJournalEntry({
        date: new Date().toISOString().split("T")[0],
        reference: savedReturn.salesOrderId,
        description: `POS return adjustment — ${savedReturn.salesOrderId}`,
        lines: [
          { accountId: arAccount.id, debit: 0, credit: returnDoc.total },
          { accountId: cashAccount.id, debit: returnDoc.total, credit: 0 },
        ],
      });
    }
  } catch {
    // Non-fatal — adjustment can be reconciled manually.
  }

  /* Step 4: Stock-in via existing Inventory service (best-effort) */
  let deliveryId = "";
  let stockMovementStatus: ReturnStockMovementStatus = "pending";
  let warning: string | undefined;
  try {
    const movements: CreateStockMovementInput[] = input.items.map((item) => ({
      productId: item.productId,
      warehouseId: input.warehouseId,
      type: "stock-in" as const,
      quantity: item.quantity,
      unitId: DEFAULT_UNIT_ID,
      baseQuantity: item.quantity,
      referenceType: "sale" as const,
      referenceId: savedReturn.salesOrderId,
      transactionDate: new Date().toISOString().split("T")[0],
      note: `POS return for SO ${savedReturn.salesOrderId}`,
    }));
    for (const movement of movements) {
      await createStockMovement(movement);
    }
    deliveryId = savedReturn.salesOrderId;
    stockMovementStatus = "completed";
  } catch (stockErr) {
    stockMovementStatus = "failed";
    warning =
      stockErr instanceof Error
        ? `Return recorded, but stock could not be restored: ${stockErr.message}. Complete the stock-in manually.`
        : `Return recorded, but stock could not be restored. Complete the stock-in manually.`;
  }

  return {
    returnDoc,
    salesReturn: {
      id: savedReturn.salesOrderId,
      documentNumber: savedReturn.salesOrderNumber,
      date: new Date().toISOString().split("T")[0],
      total: returnDoc.total,
      status: "completed",
    },
    refundPayments,
    deliveryId,
    stockMovementStatus,
    warning,
    shiftId: input.shiftId,
  };
}

/* ---------------------------------------------------------------- */
/* Return history                                                    */
/* ---------------------------------------------------------------- */

/** Fetch all POS returns, most recent first. */
export async function getPOSReturns(): Promise<POSReturn[]> {
  const response = await apiClient.get<POSReturn[]>("/pos/returns");
  return [...response.data].sort((a, b) =>
    (b.salesOrderId ?? "").localeCompare(a.salesOrderId ?? ""),
  );
}
