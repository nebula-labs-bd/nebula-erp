/**
 * POS Loyalty domain types.
 *
 * POS is the *loyalty interface* — it never owns loyalty logic. Points are
 * earned/redeemed against the existing Loyalty module (source of truth). The
 * POS only displays a customer's points card and lets the cashier apply a
 * redemption as a discount against the current sale via the existing Sales
 * discount path.
 */

/* ---------------------------------------------------------------- */
/* Loyalty                                                           */
/* ---------------------------------------------------------------- */

/** A customer's loyalty standing, mapped from the Loyalty module. */
export interface LoyaltyAccount {
  id: string;

  customerId: string;

  /** Current redeemable points balance. */
  points: number;

  /** Lifetime points earned. */
  lifetimePoints: number;

  /** ISO timestamp of the last points activity. */
  updatedAt: string;
}

/** Result of a points-earning or redemption operation. */
export interface LoyaltyResult {
  account: LoyaltyAccount;

  /** Points changed in this operation (positive = earned, negative = redeemed). */
  delta: number;

  /** Currency value applied to the sale (for redemptions). */
  appliedValue?: number;
}

/** Input for redeeming points against a sale. */
export interface RedeemPointsInput {
  customerId: string;

  /** Points to redeem. */
  points: number;

  /** Currency value of the redemption (points × rate). */
  value: number;

  /** Sale reference (for traceability in the Loyalty module). */
  saleId?: string;
}
