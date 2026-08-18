/** Query key factory for POS shift / cash-register cache. */
export const posKeys = {
  all: ["pos"] as const,

  /** Full shift history list. */
  shifts: () => [...posKeys.all, "shifts"] as const,

  /** The current open shift (+ its cash movements) for the signed-in cashier. */
  currentShift: () => [...posKeys.all, "shift", "current"] as const,

  /** Cash movements for a specific shift. */
  shiftCashMovements: (shiftId: string) =>
    [...posKeys.all, "shift", shiftId, "cash-movements"] as const,
};
