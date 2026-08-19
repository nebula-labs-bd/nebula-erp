import { useState } from "react";

import { Gift, Loader2 } from "lucide-react";

import { formatCurrency } from "../../../dashboard/utils/format";

import { useLoyaltyAccount, useRedeemPoints } from "../hooks/useLoyalty";

import {
  pointsToCurrency,
} from "../services/loyalty.service";

type RedeemPointsPanelProps = {
  customerId: string | null;
  customerName: string;
  /** Called after points are redeemed; passes the currency discount value. */
  onRedeemed?: (discountValue: number, points: number) => void;
};

/**
 * Redeem Points panel.
 * Lets the cashier redeem customer loyalty points for a currency discount
 * against the current sale. Returns the currency value to apply through the
 * existing Sales discount path at checkout.
 */
export default function RedeemPointsPanel({
  customerId,
  customerName,
  onRedeemed,
}: RedeemPointsPanelProps) {
  const { data, isLoading } = useLoyaltyAccount(customerId);
  const redeem = useRedeemPoints(customerId);
  const [redeemPointsInput, setRedeemPointsInput] = useState(0);

  const maxPoints = data?.points ?? 0;
  const redeemValue = pointsToCurrency(redeemPointsInput);

  function handleRedeem() {
    if (!customerId || redeemPointsInput <= 0) return;
    redeem.mutate(
      { points: redeemPointsInput, value: redeemValue },
      {
        onSuccess: () => {
          onRedeemed?.(redeemValue, redeemPointsInput);
          setRedeemPointsInput(0);
        },
      },
    );
  }

  if (!customerId) {
    return (
      <div className="surface flex flex-col gap-2 p-4">
        <div className="flex items-center gap-2">
          <Gift size={18} className="text-[var(--nebula-text-secondary)]" />
          <h3 className="text-sm font-semibold text-[var(--nebula-text-primary)]">
            Redeem Points
          </h3>
        </div>
        <p className="text-xs text-[var(--nebula-text-muted)]">
          Select a customer to redeem points.
        </p>
      </div>
    );
  }

  return (
    <div className="surface flex flex-col gap-3 p-4">
      <div className="flex items-center gap-2">
        <Gift size={18} className="text-[var(--nebula-text-secondary)]" />
        <h3 className="text-sm font-semibold text-[var(--nebula-text-primary)]">
          Redeem Points
        </h3>
      </div>

      {isLoading ? (
        <p className="flex items-center gap-1 text-xs text-[var(--nebula-text-muted)]">
          <Loader2 size={12} className="animate-spin" /> Loading…
        </p>
      ) : (
        <>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--nebula-text-secondary)]">
              {customerName}
            </span>
            <span className="font-semibold text-[var(--nebula-primary)]">
              {maxPoints} pts
            </span>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--nebula-text-secondary)]">
              Points to redeem (max {maxPoints})
            </label>
            <input
              type="number"
              min={0}
              max={maxPoints}
              value={redeemPointsInput}
              onChange={(e) =>
                setRedeemPointsInput(
                  Math.min(maxPoints, Math.max(0, Number(e.target.value))),
                )
              }
              className="w-full rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface)] px-3 py-2 text-sm text-[var(--nebula-text-primary)] outline-none focus:border-[var(--nebula-primary)]"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--nebula-text-secondary)]">
              Discount value
            </span>
            <span className="font-semibold text-[var(--nebula-primary)]">
              {formatCurrency(redeemValue)}
            </span>
          </div>

          <button
            type="button"
            disabled={redeemPointsInput <= 0 || redeem.isPending}
            onClick={handleRedeem}
            className="w-full rounded-lg bg-[var(--nebula-primary)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--nebula-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {redeem.isPending ? "Redeeming…" : `Redeem ${formatCurrency(redeemValue)}`}
          </button>

          {redeem.isSuccess && (
            <p className="rounded-md border border-green-300 bg-green-50 p-2 text-xs text-green-700">
              Points redeemed. Discount applied to sale.
            </p>
          )}
        </>
      )}
    </div>
  );
}
