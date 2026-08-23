/**
 * Finance Integration — future connection point for Sales, POS, Service, Purchase.
 *
 * This integration provides contracts for financial references only.
 * No accounting calculations here — Finance module owns accounting logic.
 * Other modules create references that Finance consumes.
 */

import { apiClient } from "../../api/client";
import type { ContactReference } from "../customer/customer.registry";
import type { ProductReference } from "../product/product.registry";

/** Payment method types. */
export type PaymentMethod = "cash" | "card" | "bank-transfer" | "check" | "digital-wallet" | "other";

/** Lightweight payment reference for cross-module linking. */
export interface PaymentReference {
  paymentId: string;
  paymentNumber: string;
  customerId: string;
  customerName: string;
  amount: number;
  method: PaymentMethod;
  status: "pending" | "completed" | "failed" | "refunded" | "cancelled";
  date: string;
  referenceId?: string; // Sales order, invoice, etc.
  referenceType?: "sales" | "purchase" | "service" | "pos" | "expense";
}

/** Lightweight document finance reference for cross-module linking. */
export interface DocumentFinanceReference {
  documentId: string;
  documentNumber: string;
  documentType: "sales-invoice" | "purchase-invoice" | "service-invoice" | "pos-receipt" | "credit-note" | "debit-note" | "journal-entry";
  customerId: string;
  customerName: string;
  total: number;
  status: "draft" | "pending" | "posted" | "paid" | "overdue" | "cancelled";
  date: string;
  dueDate?: string;
}

/** Lightweight journal entry reference. */
export interface JournalEntryReference {
  journalId: string;
  journalNumber: string;
  date: string;
  description: string;
  totalDebit: number;
  totalCredit: number;
  status: "draft" | "posted" | "reversed";
}

/**
 * Create a payment reference for cross-module linking.
 * Used by POS (tender), Sales (payment allocation), Service (payment), Purchase (vendor payment).
 */
export function createPaymentReference(
  paymentId: string,
  paymentNumber: string,
  customer: ContactReference,
  amount: number,
  method: PaymentMethod,
  status: PaymentReference["status"],
  date: string,
  referenceId?: string,
  referenceType?: PaymentReference["referenceType"]
): PaymentReference {
  return {
    paymentId,
    paymentNumber,
    customerId: customer.contactId,
    customerName: customer.name,
    amount,
    method,
    status,
    date,
    referenceId,
    referenceType,
  };
}

/**
 * Create a document finance reference for cross-module linking.
 * Used by Sales (invoice), Purchase (vendor bill), Service (service invoice), POS (receipt).
 */
export function createDocumentFinanceReference(
  documentId: string,
  documentNumber: string,
  documentType: DocumentFinanceReference["documentType"],
  customer: ContactReference,
  total: number,
  status: DocumentFinanceReference["status"],
  date: string,
  dueDate?: string
): DocumentFinanceReference {
  return {
    documentId,
    documentNumber,
    documentType,
    customerId: customer.contactId,
    customerName: customer.name,
    total,
    status,
    date,
    dueDate,
  };
}

/**
 * Create a journal entry reference for cross-module linking.
 * Used by Sales (COGS), Inventory (stock adjustment), Payroll, etc.
 */
export function createJournalEntryReference(
  journalId: string,
  journalNumber: string,
  date: string,
  description: string,
  totalDebit: number,
  totalCredit: number,
  status: JournalEntryReference["status"]
): JournalEntryReference {
  return {
    journalId,
    journalNumber,
    date,
    description,
    totalDebit,
    totalCredit,
    status,
  };
}

/**
 * Get payment reference by ID.
 * Used by Reconciliation, Reports, Finance.
 */
export async function getPaymentReference(
  paymentId: string
): Promise<PaymentReference | null> {
  const response = await apiClient.get<PaymentReference>(
    `/payments/${paymentId}`
  );
  return response.data ?? null;
}

/**
 * Get document finance reference by ID.
 * Used by Finance, Reports, Reconciliation.
 */
export async function getDocumentFinanceReference(
  documentId: string
): Promise<DocumentFinanceReference | null> {
  const response = await apiClient.get<DocumentFinanceReference>(
    `/finance/documents/${documentId}`
  );
  return response.data ?? null;
}

/**
 * Future: Submit document to finance for posting.
 * Finance module will own the actual posting logic.
 */
export interface PostDocumentToFinanceInput {
  document: DocumentFinanceReference;
  lineItems: Array<{
    accountId: string;
    description: string;
    debit: number;
    credit: number;
    product?: ProductReference;
    quantity?: number;
  }>;
}

export async function postDocumentToFinance(
  input: PostDocumentToFinanceInput
): Promise<{ success: boolean; journalId?: string; error?: string }> {
  // This is a placeholder for future Finance module integration.
  // Finance will implement the actual posting logic.
  // `input` is retained for shape/contract validation and future use.
  void input;
  return {
    success: true,
    journalId: `JE-${Date.now()}`,
  };
}