import { apiClient } from "../../../api/client";

import type {
  BalanceSheetReport,
  CashFlowReport,
  FinancialSummary,
  ProfitLossReport,
  ReportPeriod,
} from "../types/report.types";

/**
 * Reporting service — aggregates existing ERP data into business views.
 *
 * READ-ONLY by design. Every function issues a GET request against the
 * reports API and never creates or mutates any underlying record
 * (inventory, stock, products, payments, accounting, etc.).
 */

/** Build an optional period query string for the report endpoints. */
function buildPeriodQuery(period?: ReportPeriod): string {
  if (!period) {
    return "";
  }

  const params = new URLSearchParams();

  if (period.startDate) {
    params.set("startDate", period.startDate);
  }

  if (period.endDate) {
    params.set("endDate", period.endDate);
  }

  if (period.type) {
    params.set("type", period.type);
  }

  const query = params.toString();

  return query ? `?${query}` : "";
}

/* ------------------------------------------------------------------ */
/* Financial Summary                                                   */
/* ------------------------------------------------------------------ */

export function getFinancialSummary(period?: ReportPeriod) {
  return apiClient.get<FinancialSummary>(
    `/reports/financial-summary${buildPeriodQuery(period)}`,
  );
}

/* ------------------------------------------------------------------ */
/* Profit & Loss                                                       */
/* ------------------------------------------------------------------ */

export function getProfitLoss(period?: ReportPeriod) {
  return apiClient.get<ProfitLossReport>(
    `/reports/profit-loss${buildPeriodQuery(period)}`,
  );
}

/* ------------------------------------------------------------------ */
/* Balance Sheet                                                       */
/* ------------------------------------------------------------------ */

export function getBalanceSheet(period?: ReportPeriod) {
  return apiClient.get<BalanceSheetReport>(
    `/reports/balance-sheet${buildPeriodQuery(period)}`,
  );
}

/* ------------------------------------------------------------------ */
/* Cash Flow                                                           */
/* ------------------------------------------------------------------ */

export function getCashFlow(period?: ReportPeriod) {
  return apiClient.get<CashFlowReport>(
    `/reports/cash-flow${buildPeriodQuery(period)}`,
  );
}
