/**
 * POS Cash Register / Shift domain types.
 *
 * A *shift* is the cashier's working session at the register. It is POS
 * operational logic only — it never mutates accounting or inventory. The
 * register tracks money through `CashMovement` rows (sales, refunds, expenses,
 * manual cash-in / cash-out) so the expected cash at any moment can be derived
 * without touching the accounting ledger.
 *
 *   Cashier opens register → makes sales → tracks money → closes register →
 *     reconciles cash
 */

/* ---------------------------------------------------------------- */
/* Shift                                                             */
/* ---------------------------------------------------------------- */

/** Lifecycle of a cashier shift. */
export type ShiftStatus = "open" | "closed";

/** A single cashier shift at a POS register. */
export interface POSShift {
  /** Server-assigned shift id. */
  id: string;

  /** Id of the user (cashier) who opened the shift. */
  userId: string;

  /** Display name of the cashier. */
  cashierName: string;

  status: ShiftStatus;

  /** ISO timestamp the shift was opened. */
  openedAt: string;

  /** ISO timestamp the shift was closed (only when `status === "closed"`). */
  closedAt?: string;

  /** Float counted into the drawer at open. */
  openingCash: number;

  /** Float counted out of the drawer at close. */
  closingCash?: number;

  /** Expected cash in the drawer (opening + net movements), computed at close. */
  expectedCash?: number;

  /** Closing counted cash minus expected cash (0 == perfect). */
  difference?: number;
}

/* ---------------------------------------------------------------- */
/* Cash movement                                                    */
/* ---------------------------------------------------------------- */

/** Category of a cash movement recorded against a shift. */
export type CashMovementType =
  | "sale"
  | "refund"
  | "expense"
  | "cash_in"
  | "cash_out";

/** A single cash event recorded against a shift. This is the ledger the
 * register uses to reconcile — it is independent of the accounting module. */
export interface CashMovement {
  id: string;

  shiftId: string;

  type: CashMovementType;

  amount: number;

  description: string;

  /** ISO timestamp of the movement. */
  date: string;
}

/* ---------------------------------------------------------------- */
/* Service input shapes                                             */
/* ---------------------------------------------------------------- */

/** Body for opening a shift. */
export interface OpenShiftInput {
  /** Counted opening float. */
  openingCash: number;

  /** Optional cashier display name (server may override from auth). */
  cashierName?: string;
}

/** Body for closing a shift. */
export interface CloseShiftInput {
  /** Physically counted closing cash. */
  closingCash: number;
}

/** Body for recording a cash movement against an open shift. */
export interface AddCashMovementInput {
  type: CashMovementType;

  amount: number;

  description?: string;
}
