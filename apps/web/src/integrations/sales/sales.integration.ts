/**
 * Sales Integration — connects POS, Sales, Payment, and Delivery modules.
 *
 * Provides contracts for cross-module sales workflows:
 * - POS creates sales orders via this integration
 * - Payments link to sales documents
 * - Deliveries reference sales orders
 * - Sales remains the source of truth for order data
 */

import { apiClient } from "../../api/client";
import type { ProductReference } from "../product/product.registry";

/** Sales document types. */
export type SalesDocumentType = "order" | "invoice" | "credit-note" | "return";

/** Lightweight sales order reference for cross-module linking. */
export interface SalesOrderReference {
  salesOrderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  status: "draft" | "confirmed" | "delivered" | "invoiced" | "cancelled";
  total: number;
  date: string;
}

/** Lightweight delivery reference for cross-module linking. */
export interface DeliveryReference {
  deliveryId: string;
  deliveryNumber: string;
  salesOrderId: string;
  warehouseId: string;
  status: "pending" | "partial" | "completed" | "cancelled";
  date: string;
}

/** Lightweight invoice reference for cross-module linking. */
export interface InvoiceReference {
  invoiceId: string;
  invoiceNumber: string;
  salesOrderId: string;
  customerId: string;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  total: number;
  date: string;
  dueDate: string;
}

/** POS transaction mapped to sales order input. */
export interface POSTransactionToSalesInput {
  customer: { customerId: string; name: string };
  warehouseId: string;
  items: Array<{
    product: ProductReference;
    quantity: number;
    price: number;
    discount: number;
    tax: number;
    unitId?: string;
  }>;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  shiftId?: string;
}

/**
 * Map a POS transaction to a Sales Order input.
 * Used by POS to create a real sales order via the sales module.
 */
export function mapPOSTransactionToSales(
  posTransaction: POSTransactionToSalesInput
): {
  customerId: string;
  warehouseId: string;
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    tax: number;
    unitId?: string;
  }>;
  reference: string;
} {
  return {
    customerId: posTransaction.customer.customerId,
    warehouseId: posTransaction.warehouseId,
    items: posTransaction.items.map((item) => ({
      productId: item.product.productId,
      quantity: item.quantity,
      unitPrice: item.price,
      discount: item.discount,
      tax: item.tax,
      unitId: item.unitId,
    })),
    reference: `POS-${Date.now()}`,
  };
}

/**
 * Get a sales document reference by ID.
 * Used by Payment, Delivery, Finance modules to link to sales documents.
 */
export async function getSalesDocumentReference(
  documentId: string,
  type: SalesDocumentType = "order"
): Promise<SalesOrderReference | DeliveryReference | InvoiceReference | null> {
  const endpoint = type === "order" 
    ? `/sales/orders/${documentId}`
    : type === "invoice"
    ? `/sales/invoices/${documentId}`
    : `/sales/deliveries/${documentId}`;

  const response = await apiClient.get<
    SalesOrderReference | DeliveryReference | InvoiceReference
  >(endpoint);
  return response.data ?? null;
}

/**
 * Create a lightweight sales reference for cross-module linking.
 * Used by Payment (allocation), Delivery (fulfillment), Finance (journal).
 */
export function createSalesReference(
  salesOrderId: string,
  orderNumber: string,
  customerId: string,
  customerName: string,
  total: number,
  status: SalesOrderReference["status"],
  date: string
): SalesOrderReference {
  return {
    salesOrderId,
    orderNumber,
    customerId,
    customerName,
    status,
    total,
    date,
  };
}

/**
 * Create a lightweight delivery reference for cross-module linking.
 * Used by Inventory (stock movement), Finance (COGS), Reports.
 */
export function createDeliveryReference(
  deliveryId: string,
  deliveryNumber: string,
  salesOrderId: string,
  warehouseId: string,
  status: DeliveryReference["status"],
  date: string
): DeliveryReference {
  return {
    deliveryId,
    deliveryNumber,
    salesOrderId,
    warehouseId,
    status,
    date,
  };
}

/**
 * Create a lightweight invoice reference for cross-module linking.
 * Used by Payment (allocation), Finance (AR), Reports.
 */
export function createInvoiceReference(
  invoiceId: string,
  invoiceNumber: string,
  salesOrderId: string,
  customerId: string,
  total: number,
  status: InvoiceReference["status"],
  date: string,
  dueDate: string
): InvoiceReference {
  return {
    invoiceId,
    invoiceNumber,
    salesOrderId,
    customerId,
    status,
    total,
    date,
    dueDate,
  };
}