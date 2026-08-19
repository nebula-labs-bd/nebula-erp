/**
 * POS Reports service.
 *
 * Read-only aggregation layer for POS dashboards. Each function delegates to
 * the backend reporting endpoint; POS never touches inventory/accounting
 * tables directly — it receives pre-computed summaries.
 */

import { apiClient } from "../../../../api/client";

import type {
  POSDailySummary,
  POSPaymentSummary,
  POSTopProduct,
  POSReportParams,
} from "../types/report.types";

/** Build a query string from the report params. */
function buildQuery(params: POSReportParams): string {
  const qs = new URLSearchParams();
  if (params.date) qs.set("date", params.date);
  if (params.shiftId) qs.set("shiftId", params.shiftId);
  if (params.startDate) qs.set("startDate", params.startDate);
  if (params.endDate) qs.set("endDate", params.endDate);
  const s = qs.toString();
  return s ? `?${s}` : "";
}

/* ---------------------------------------------------------------- */
/* Daily summary                                                     */
/* ---------------------------------------------------------------- */

/** Fetch the end-of-day summary for a date/shift. */
export async function getPOSDailySummary(
  params: POSReportParams,
): Promise<POSDailySummary> {
  const response = await apiClient.get<POSDailySummary>(
    `/pos/reports/daily${buildQuery(params)}`,
  );
  return response.data;
}

/* ---------------------------------------------------------------- */
/* Top products                                                      */
/* ---------------------------------------------------------------- */

/** Fetch the top-selling products for the period. */
export async function getPOSTopProducts(
  params: POSReportParams,
): Promise<POSTopProduct[]> {
  const response = await apiClient.get<POSTopProduct[]>(
    `/pos/reports/top-products${buildQuery(params)}`,
  );
  return response.data;
}

/* ---------------------------------------------------------------- */
/* Payment summary                                                   */
/* ---------------------------------------------------------------- */

/** Fetch the payment-method breakdown for the period. */
export async function getPOSPaymentSummary(
  params: POSReportParams,
): Promise<POSPaymentSummary> {
  const response = await apiClient.get<POSPaymentSummary>(
    `/pos/reports/payment-summary${buildQuery(params)}`,
  );
  return response.data;
}

