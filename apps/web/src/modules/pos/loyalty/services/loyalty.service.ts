/**
 * POS Loyalty service.
 *
 * Bridge between the POS loyalty interface and the existing Loyalty module
 * (source of truth for points). POS never stores or mutates points directly —
 * it delegates earn/redeem to the Loyalty service and reads the resulting
 * account state.
 *
 *   POS → Loyalty (earn/redeem) → (downstream rewards, not POS concern)
 *
 * Points redemption returns a currency value that the POS applies as a discount
 * through the existing Sales discount path at checkout.
 */

import { apiClient } from "../../../../api/client";

import type {
  LoyaltyAccount,
  LoyaltyResult,
  RedeemPointsInput,
} from "../types/loyalty.types";

/** Conversion rate: 1 point = this many currency units. */
const POINTS_TO_CURRENCY = 0.1;

/* ---------------------------------------------------------------- */
/* Read                                                               */
/* ---------------------------------------------------------------- */

/** Fetch a customer's loyalty account (or null if none yet). */
export async function getLoyaltyAccount(
  customerId: string,
): Promise<LoyaltyAccount | null> {
  try {
    const response = await apiClient.get<LoyaltyAccount[]>(
      `/loyalty/accounts?customerId=${encodeURIComponent(customerId)}`,
    );
    return response.data[0] ?? null;
  } catch {
    return null;
  }
}

/* ---------------------------------------------------------------- */
/* Earn                                                               */
/* ---------------------------------------------------------------- */

/**
 * Award loyalty points for a completed sale. Delegates to the Loyalty module.
 */
export async function earnPoints(
  customerId: string,
  points: number,
  saleId?: string,
): Promise<LoyaltyResult> {
  const response = await apiClient.post<LoyaltyAccount>(
    "/loyalty/earn",
    { customerId, points, saleId },
  );
  return { account: response.data, delta: points };
}

/* ---------------------------------------------------------------- */
/* Redeem                                                            */
/* ---------------------------------------------------------------- */

/**
 * Redeem loyalty points against a sale. Delegates to the Loyalty module and
 * returns the currency value to apply as a discount via the Sales path.
 */
export async function redeemPoints(
  input: RedeemPointsInput,
): Promise<LoyaltyResult> {
  const response = await apiClient.post<LoyaltyAccount>(
    "/loyalty/redeem",
    {
      customerId: input.customerId,
      points: input.points,
      saleId: input.saleId,
    },
  );
  return {
    account: response.data,
    delta: -input.points,
    appliedValue: input.value,
  };
}

/** Convert a number of points to currency using the configured rate. */
export function pointsToCurrency(points: number): number {
  return Math.round(points * POINTS_TO_CURRENCY * 100) / 100;
}

/** Convert a currency amount to points using the configured rate (floored). */
export function currencyToPoints(amount: number): number {
  return Math.floor(amount / POINTS_TO_CURRENCY);
}
