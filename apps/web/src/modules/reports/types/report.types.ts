/**
 * Financial Reports — domain types.
 *
 * These types describe the *aggregated* business views that the reporting
 * module derives from existing ERP data. The reports module is strictly
 * READ-ONLY: it never creates transactions or mutates accounting, inventory,
 * payments, or any other source records.
 */

/* ------------------------------------------------------------------ */
/* Period                                                               */
/* ------------------------------------------------------------------ */

export type ReportPeriodType =
  | "custom"
  | "monthly"
  | "yearly";

export interface ReportPeriod {
  /** ISO date (YYYY-MM-DD) marking the start of the reporting window. */
  startDate: string;

  /** ISO date (YYYY-MM-DD) marking the end of the reporting window. */
  endDate: string;

  /** Optional granularity hint used by future monthly/yearly reports. */
  type?: ReportPeriodType;
}

/* ------------------------------------------------------------------ */
/* Profit & Loss                                                       */
/* ------------------------------------------------------------------ */

export interface ProfitLossReport {
  period: ReportPeriod;

  /** Total recognised revenue for the period. */
  revenue: number;

  /** Total recognised expenses for the period. */
  expenses: number;

  /** Net profit (revenue - expenses). */
  netProfit: number;
}

/* ------------------------------------------------------------------ */
/* Balance Sheet                                                       */
/* ------------------------------------------------------------------ */

export interface BalanceSheetReport {
  period: ReportPeriod;

  /** Total assets (current + fixed). */
  assets: number;

  /** Total liabilities (payables + obligations). */
  liabilities: number;

  /** Total equity (retained earnings + capital). */
  equity: number;
}

/* ------------------------------------------------------------------ */
/* Cash Flow                                                           */
/* ------------------------------------------------------------------ */

export interface CashFlowReport {
  period: ReportPeriod;

  /** Total cash received during the period. */
  cashIn: number;

  /** Total cash paid out during the period. */
  cashOut: number;

  /** Net cash flow (cashIn - cashOut). */
  netCashFlow: number;
}

/* ------------------------------------------------------------------ */
/* Financial Summary                                                   */
/* ------------------------------------------------------------------ */

export interface FinancialSummary {
  /** Total sales booked across the business. */
  totalSales: number;

  /** Total purchases committed across the business. */
  totalPurchases: number;

  /** Total operating expenses recorded. */
  totalExpenses: number;

  /** Total value of registered assets. */
  totalAssets: number;

  /** Total liabilities outstanding. */
  totalLiabilities: number;

  /** Total amount receivable from customers. */
  totalReceivable: number;

  /** Total amount payable to suppliers. */
  totalPayable: number;
}
