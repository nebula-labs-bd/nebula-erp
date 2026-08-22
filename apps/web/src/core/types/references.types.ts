/**
 * Cross-module document references.
 *
 * These lightweight interfaces describe how transactional documents chain
 * together without any module owning another's full shape:
 *
 *   POS  →  Sales  →  Payment  →  Accounting
 *
 * A module stores the upstream reference id (and a denormalised label for
 * display) so the relationship graph is navigable end to end.
 */

export interface POSTransactionReference {
  posTransactionId: string;
  reference?: string;
}

export interface SalesOrderReference {
  salesOrderId: string;
  orderNumber?: string;
}

export interface PaymentReference {
  paymentId: string;
  method?: string;
  amount?: number;
}
