/**
 * POS Reports hooks.
 *
 * React Query integration for the read-only POS reports. Reports are
 * derived from the backend; POS only displays them.
 */

import { useQuery } from "@tanstack/react-query";

import {
  getPOSDailySummary,
  getPOSTopProducts,
  getPOSPaymentSummary,
} from "../services/pos-report.service";

import type { POSReportParams } from "../types/report.types";

/* ---------------------------------------------------------------- */
/* Query keys                                                        */
/* ---------------------------------------------------------------- */

export const posReportKeys = {
  all: ["pos", "reports"] as const,

  daily: (params: POSReportParams) =>
    [...posReportKeys.all, "daily", params] as const,

  topProducts: (params: POSReportParams) =>
    [...posReportKeys.all, "top-products", params] as const,

  paymentSummary: (params: POSReportParams) =>
    [...posReportKeys.all, "payment-summary", params] as const,
};

/* ---------------------------------------------------------------- */
/* Hooks                                                             */
/* ---------------------------------------------------------------- */

/** Daily end-of-day summary. */
export function usePOSDailySummary(params: POSReportParams) {
  return useQuery({
    queryKey: posReportKeys.daily(params),
    queryFn: () => getPOSDailySummary(params),
  });
}

/** Top-selling products. */
export function usePOSTopProducts(params: POSReportParams) {
  return useQuery({
    queryKey: posReportKeys.topProducts(params),
    queryFn: () => getPOSTopProducts(params),
  });
}

/** Payment-method breakdown. */
export function usePOSPaymentSummary(params: POSReportParams) {
  return useQuery({
    queryKey: posReportKeys.paymentSummary(params),
    queryFn: () => getPOSPaymentSummary(params),
  });
}
