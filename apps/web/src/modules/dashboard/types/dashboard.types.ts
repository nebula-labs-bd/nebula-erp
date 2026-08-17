/**
 * Dashboard — domain types.
 *
 * These types describe the *aggregated* business views that the dashboard
 * command center derives from existing ERP data (sales, purchases, expenses,
 * inventory, payments, accounting). The dashboard module is strictly READ-ONLY:
 * it never creates transactions or mutates inventory, stock, products,
 * payments, accounting records, or any other source data.
 */

/* ------------------------------------------------------------------ */
/* Dashboard Summary                                                   */
/* ------------------------------------------------------------------ */

export interface DashboardSummary {
  /** Total sales value booked today. */
  salesToday: number;

  /** Total purchase value committed today. */
  purchaseToday: number;

  /** Total operating expenses recorded today. */
  expenseToday: number;

  /** Net profit for today (salesToday - purchaseToday - expenseToday). */
  profitToday: number;

  /** Current available cash balance. */
  cashBalance: number;

  /** Total amount receivable from customers. */
  receivable: number;

  /** Total amount payable to suppliers. */
  payable: number;
}

/* ------------------------------------------------------------------ */
/* Inventory Summary                                                   */
/* ------------------------------------------------------------------ */

export interface InventorySummary {
  /** Total number of products in the catalogue. */
  totalProducts: number;

  /** Total monetary value of on-hand stock. */
  stockValue: number;

  /** Number of products below their reorder level. */
  lowStockCount: number;

  /** Number of products fully out of stock. */
  outOfStockCount: number;
}

/* ------------------------------------------------------------------ */
/* Recent Activity                                                     */
/* ------------------------------------------------------------------ */

export type ActivityType =
  | "sale"
  | "payment"
  | "purchase"
  | "stock-movement";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  /** ISO timestamp of when the activity occurred. */
  date: string;
}
