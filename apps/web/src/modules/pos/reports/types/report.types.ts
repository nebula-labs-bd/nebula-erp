/**
 * POS Reports domain types.
 *
 * POS reports are read-only — they query aggregated data from the backend.
 * POS never computes analytics from raw inventory/accounting data directly;
 * the backend returns pre-computed summaries for POS display.
 */

/* ---------------------------------------------------------------- */
/* Daily Summary                                                     */
/* ---------------------------------------------------------------- */

/** End-of-day summary for a POS shift / register. */
export interface POSDailySummary {
  date: string;

  shiftId: string;

  cashierName: string;

  openingCash: number;

  closingCash: number;

  expectedCash: number;

  difference: number;

  /** Total sales (gross, before refunds). */
  totalSales: number;

  /** Total refunds processed. */
  totalRefunds: number;

  /** Net sales = totalSales - totalRefunds. */
  netSales: number;

  /** Number of transactions. */
  transactionCount: number;

  /** Average sale value. */
  averageSale: number;
}

/* ---------------------------------------------------------------- */
/* Top Products                                                      */
/* ---------------------------------------------------------------- */

/** A product line in the "top products" report. */
export interface POSTopProduct {
  productId: string;

  productName: string;

  sku: string;

  /** Total units sold in the period. */
  quantitySold: number;

  /** Total revenue (price × quantity) in the period. */
  revenue: number;

  /** Product's share of total revenue (%). */
  revenueShare: number;
}

/* ---------------------------------------------------------------- */
/* Payment Summary                                                   */
/* ---------------------------------------------------------------- */

/** A single payment method line in the report. */
export interface POSPaymentLine {
  method: string;

  count: number;

  total: number;

  /** Share of overall payment value (%). */
  share: number;
}

/** Aggregate payment breakdown for a POS period. */
export interface POSPaymentSummary {
  date: string;

  totalPayments: number;

  methods: POSPaymentLine[];
}

/* ---------------------------------------------------------------- */
/* Report query params                                               */
/* ---------------------------------------------------------------- */

/** Parameters for fetching POS reports. */
export interface POSReportParams {
  date?: string;

  shiftId?: string;

  startDate?: string;

  endDate?: string;
}
