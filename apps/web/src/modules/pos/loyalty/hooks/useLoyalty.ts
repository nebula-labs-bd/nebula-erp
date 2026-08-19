/**
 * POS Loyalty hook.
 *
 * React Query integration for reading/earning/redeeming loyalty points.
 * Points state lives in the Loyalty module — these hooks invalidate the
 * loyalty cache after mutations so the UI reflects the source of truth.
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  earnPoints,
  getLoyaltyAccount,
  redeemPoints,
} from "../services/loyalty.service";

import type { RedeemPointsInput } from "../types/loyalty.types";

/* ---------------------------------------------------------------- */
/* Query keys                                                        */
/* ---------------------------------------------------------------- */

export const loyaltyKeys = {
  all: ["pos", "loyalty"] as const,
  account: (customerId: string) =>
    [...loyaltyKeys.all, "account", customerId] as const,
};

/* ---------------------------------------------------------------- */
/* Read account                                                      */
/* ---------------------------------------------------------------- */

/** Load a customer's loyalty account (null if none). */
export function useLoyaltyAccount(customerId: string | null) {
  return useQuery({
    queryKey: customerId ? loyaltyKeys.account(customerId) : ["pos", "loyalty", "none"],
    queryFn: () => getLoyaltyAccount(customerId as string),
    enabled: !!customerId,
  });
}

/* ---------------------------------------------------------------- */
/* Earn points                                                      */
/* ---------------------------------------------------------------- */

/**
 * Award points after a sale. Invalidates the account cache on success.
 */
export function useEarnPoints(customerId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (points: number) =>
      earnPoints(customerId as string, points),
    onSuccess: () => {
      if (customerId) {
        queryClient.invalidateQueries({
          queryKey: loyaltyKeys.account(customerId),
        });
      }
    },
  });
}

/* ---------------------------------------------------------------- */
/* Redeem points                                                    */
/* ---------------------------------------------------------------- */

/**
 * Redeem points against a sale. Invalidates the account cache on success.
 */
export function useRedeemPoints(customerId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<RedeemPointsInput, "customerId">) =>
      redeemPoints({ ...input, customerId: customerId as string }),
    onSuccess: () => {
      if (customerId) {
        queryClient.invalidateQueries({
          queryKey: loyaltyKeys.account(customerId),
        });
      }
    },
  });
}
