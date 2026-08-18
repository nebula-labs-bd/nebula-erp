import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  addCashMovement,
  closeShift,
  getCurrentShift,
  getCashMovements,
  getShiftHistory,
  openShift,
} from "../services/shift.service";

import { posKeys } from "../queries/shift.keys";

import type {
  CashMovement,
  CloseShiftInput,
  OpenShiftInput,
  POSShift,
  AddCashMovementInput,
} from "../types/shift.types";

/** Combined view of the active register: the open shift plus the cash
 * movements recorded against it. */
export interface CurrentShiftData {
  shift: POSShift | null;
  movements: CashMovement[];
}

/**
 * Load the current open shift for the signed-in cashier, plus its cash
 * movements, so the register panel and close-shift reconciliation can derive
 * live expected-cash figures entirely within POS operational logic.
 */
export function useCurrentShift() {
  return useQuery<CurrentShiftData>({
    queryKey: posKeys.currentShift(),
    queryFn: async () => {
      const shift = await getCurrentShift();

      if (!shift) {
        return { shift: null, movements: [] };
      }

      const movements = await getCashMovements(shift.id);

      return { shift, movements: movements.data };
    },
  });
}

/** Load the full shift history. */
export function useShiftHistory() {
  return useQuery({
    queryKey: posKeys.shifts(),
    queryFn: async () => getShiftHistory(),
  });
}

/**
 * Shift mutations: open, close, and record cash movements. On success the
 * shift cache is invalidated so the register UI refreshes.
 */
export function useShiftMutation() {
  const queryClient = useQueryClient();

  const refresh = () => {
    queryClient.invalidateQueries({
      queryKey: posKeys.currentShift(),
    });

    queryClient.invalidateQueries({
      queryKey: posKeys.shifts(),
    });
  };

  const open = useMutation({
    mutationFn: (input: OpenShiftInput) => openShift(input),
    onSuccess: refresh,
  });

  const close = useMutation({
    mutationFn: ({
      shiftId,
      input,
    }: {
      shiftId: string;
      input: CloseShiftInput;
    }) => closeShift(shiftId, input),
    onSuccess: refresh,
  });

  const addMovement = useMutation({
    mutationFn: ({
      shiftId,
      input,
    }: {
      shiftId: string;
      input: AddCashMovementInput;
    }) => addCashMovement(shiftId, input),
    onSuccess: refresh,
  });

  return { open, close, addMovement };
}
