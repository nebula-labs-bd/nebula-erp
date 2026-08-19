/**
 * POS Returns hook.
 *
 * Provides React Query integration for POS return operations.
 * Returns are POS interface layer — refunds, stock-in, and accounting
 * adjustments are delegated to existing modules via `return.service`.
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  findInvoice,
  createPOSReturn,
  getPOSReturns,
} from "../services/return.service";

import type { POSReturnItem } from "../types/return.types";

/* ---------------------------------------------------------------- */
/* Query keys                                                        */
/* ---------------------------------------------------------------- */

export const returnKeys = {
  all: ["pos"] as const,
  returns: () => [...returnKeys.all, "returns"] as const,
};

/* ---------------------------------------------------------------- */
/* Find Invoice                                                      */
/* ---------------------------------------------------------------- */

/** Look up an invoice (SalesOrder) by order number for the return form. */
export function useFindInvoice(orderNumber: string) {
  return useQuery({
    queryKey: [...returnKeys.all, "find-invoice", orderNumber],
    queryFn: () => findInvoice(orderNumber),
    enabled: orderNumber.trim().length > 0,
  });
}

/* ---------------------------------------------------------------- */
/* Return History                                                    */
/* ---------------------------------------------------------------- */

/** Load all POS returns for the return history panel. */
export function useReturnHistory() {
  return useQuery({
    queryKey: returnKeys.returns(),
    queryFn: () => getPOSReturns(),
  });
}

/* ---------------------------------------------------------------- */
/* Create Return                                                     */
/* ---------------------------------------------------------------- */

export interface CreateReturnPayload {
  salesOrderId: string;
  salesOrderNumber: string;
  customerId: string;
  warehouseId: string;
  items: POSReturnItem[];
  reason: string;
  notes?: string;
  shiftId?: string;
}

/**
 * Submit a POS return. On success, invalidates the return history cache
 * so the history panel refreshes automatically.
 */
export function useCreateReturn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReturnPayload) =>
      createPOSReturn(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: returnKeys.returns(),
      });
    },
  });
}
