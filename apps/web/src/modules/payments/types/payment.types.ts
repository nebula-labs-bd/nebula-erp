export type PaymentType = "payable" | "receivable";

export type PaymentMethod =
  | "cash"
  | "bank"
  | "card"
  | "mobile"
  | "bkash"
  | "nagad"
  | "other";

export type PaymentStatus = "pending" | "completed" | "cancelled";

export interface Payment {
  id: string;
  type: PaymentType;
  partyId: string;
  amount: number;
  method: PaymentMethod;
  date: string;
  reference: string;
  status: PaymentStatus;
  note: string;
  createdAt: string;
}

export interface CreatePaymentInput {
  type: PaymentType;
  partyId: string;
  amount: number;
  method: PaymentMethod;
  date: string;
  reference: string;
  note: string;
  status: PaymentStatus;
}

export interface UpdatePaymentInput extends Partial<CreatePaymentInput> {
  id: string;
}

export type PayableStatus =
  | "paid"
  | "partial"
  | "due";

export interface SupplierPayable {
  supplierId: string;
  supplierName: string;
  invoiceAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: PayableStatus;
}

export interface CustomerReceivable {
  customerId: string;
  customerName: string;
  invoiceAmount: number;
  receivedAmount: number;
  dueAmount: number;
  status: PayableStatus;
}

/* ---------------------------------------------------------------- */
/* Payment Allocation                                               */
/* ---------------------------------------------------------------- */

export type AllocationDocumentType =
  | "sales_invoice"
  | "purchase_invoice";

export interface PaymentAllocation {
  id: string;
  paymentId: string;
  documentId: string;
  documentType: AllocationDocumentType;
  documentNumber: string;
  documentDate: string;
  documentTotal: number;
  allocatedAmount: number;
  createdAt: string;
}

export interface CreatePaymentAllocationInput {
  paymentId: string;
  documentId: string;
  documentType: AllocationDocumentType;
  documentNumber: string;
  documentDate: string;
  documentTotal: number;
  allocatedAmount: number;
}

/* ---------------------------------------------------------------- */
/* Outstanding Document (for allocation UI / FIFO engine)           */
/* ---------------------------------------------------------------- */

export interface OutstandingDocument {
  documentId: string;
  documentType: AllocationDocumentType;
  documentNumber: string;
  date: string;
  total: number;
  paid: number;
  due: number;
}