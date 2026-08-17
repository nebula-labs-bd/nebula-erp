import type { ReportPeriod } from "../types/report.types";

/**
 * Query keys for the reporting module.
 *
 * Mirrors the structure of `accountingKeys`, `expenseKeys` and `assetKeys`:
 * a stable `all` root plus factory functions for each report. Period
 * parameters are appended to the key so cached results are scoped per
 * reporting window.
 */
export const reportKeys = {
  all: ["reports"] as const,

  financialSummary: (period?: ReportPeriod) =>
    [...reportKeys.all, "financial-summary", period ?? "all"] as const,

  profitLoss: (period?: ReportPeriod) =>
    [...reportKeys.all, "profit-loss", period ?? "all"] as const,

  balanceSheet: (period?: ReportPeriod) =>
    [...reportKeys.all, "balance-sheet", period ?? "all"] as const,

  cashFlow: (period?: ReportPeriod) =>
    [...reportKeys.all, "cash-flow", period ?? "all"] as const,
};
