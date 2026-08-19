import { Award, Loader2 } from "lucide-react";

import { formatCurrency } from "../../../dashboard/utils/format";

import {
  useLoyaltyAccount,
  useEarnPoints,
} from "../hooks/useLoyalty";

import {
  pointsToCurrency,
} from "../services/loyalty.service";

type CustomerPointsCardProps = {
  customerId: string | null;
  customerName: string;
  /** Sale total used to compute points earned (e.g. 1 point per $1). */
  saleTotal: number;
  /** Called after points are earned. */
  onEarned?: (points: number) => void;
};

/**
 * Customer Loyalty Points card.
 * Displays the customer's points balance and lets the cashier award points
 * earned from the current sale. Points are persisted via the Loyalty module.
 */
export default function CustomerPointsCard({
  customerId,
  customerName,
  saleTotal,
  onEarned,
}: CustomerPointsCardProps) {
  const { data, isLoading } = useLoyaltyAccount(customerId);
  const earn = useEarnPoints(customerId);

  const pointsToEarn = Math.floor(saleTotal);

  function handleEarn() {
    if (!customerId || pointsToEarn <= 0) return;
    earn.mutate(pointsToEarn, { onSuccess: () => onEarned?.(pointsToEarn) });
  }

  return (
    <div className="surface flex flex-col gap-3 p-4">
      <div className="flex items-center gap-2">
        <Award size={18} className="text-[var(--nebula-text-secondary)]" />
        <h3 className="text-sm font-semibold text-[var(--nebula-text-primary)]">
          Loyalty
        </h3>
      </div>

      <p className="text-sm text-[var(--nebula-text-secondary)]">
        {customerName || "Walk-in customer"}
      </p>

      {!customerId ? (
        <p className="text-xs text-[var(--nebula-text-muted)]">
          Select a customer to use loyalty.
        </p>
      ) : isLoading ? (
        <p className="flex items-center gap-1 text-xs text-[var(--nebula-text-muted)]">
          <Loader2 size={12} className="animate-spin" /> Loading points…
        </p>
      ) : (
        <>
          <div className="flex items-center justify-between rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-3">
            <div>
              <p className="text-xs text-[var(--nebula-text-muted)]">Balance</p>
              <p className="text-lg font-bold text-[var(--nebula-primary)]">
                {data?.points ?? 0} pts
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[var(--nebula-text-muted)]">Value</p>
              <p className="text-sm font-semibold text-[var(--nebula-text-primary)]">
                {formatCurrency(pointsToCurrency(data?.points ?? 0))}
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={pointsToEarn <= 0 || earn.isPending}
            onClick={handleEarn}
            className="w-full rounded-lg bg-[var(--nebula-primary)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--nebula-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {earn.isPending
              ? "Awarding…"
              : `Earn ${pointsToEarn} pts (${formatCurrency(saleTotal)})`}
          </button>
        </>
      )}
    </div>
  );
}
