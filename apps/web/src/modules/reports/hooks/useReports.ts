import { useQuery } from "@tanstack/react-query";

import {
  getBalanceSheet,
  getCashFlow,
  getFinancialSummary,
  getProfitLoss,
} from "../services/report.service";

import { reportKeys } from "../queries/report.keys";

import type { ReportPeriod } from "../types/report.types";

/**
 * Reporting hooks — READ-ONLY data access.
 *
 * The reports module never mutates source data, so these hooks only expose
 * `useQuery`. No `useMutation` or `invalidateQueries` is provided because
 * there are no report mutations; if future writes are introduced they can
 * invalidate `reportKeys.all` without affecting the source modules.
 */

export function useFinancialSummary(period?: ReportPeriod) {
  return useQuery({
    queryKey: reportKeys.financialSummary(period),
    queryFn: async () => {
      const response = await getFinancialSummary(period);
      return response.data;
    },
  });
}

export function useProfitLoss(period?: ReportPeriod) {
  return useQuery({
    queryKey: reportKeys.profitLoss(period),
    queryFn: async () => {
      const response = await getProfitLoss(period);
      return response.data;
    },
  });
}

export function useBalanceSheet(period?: ReportPeriod) {
  return useQuery({
    queryKey: reportKeys.balanceSheet(period),
    queryFn: async () => {
      const response = await getBalanceSheet(period);
      return response.data;
    },
  });
}

export function useCashFlow(period?: ReportPeriod) {
  return useQuery({
    queryKey: reportKeys.cashFlow(period),
    queryFn: async () => {
      const response = await getCashFlow(period);
      return response.data;
    },
  });
}
