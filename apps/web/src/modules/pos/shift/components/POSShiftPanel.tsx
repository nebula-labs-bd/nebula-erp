import { useMemo } from "react";

import { User, Clock, Wallet, Banknote } from "lucide-react";

import { formatCurrency } from "../../../dashboard/utils/format";

import type {
  CashMovement,
  POSShift,
} from "../types/shift.types";

/** Props for the active-shift summary panel. */
type POSShiftPanelProps = {
  shift: POSShift;

  /** Cash movements recorded against the shift. */
  movements: CashMovement[];

  /** Open the close-shift reconciliation screen. */
  onCloseShift: () => void;
};

/**
 * Active Shift panel.
 *
 * Pinned at the top of the POS workspace while a shift is open. Shows the
 * cashier, start time, opening float, running sales total and expected cash —
 * all derived from the shift's cash movements (POS operational logic only).
 */
export default function POSShiftPanel({
  shift,
  movements,
  onCloseShift,
}: POSShiftPanelProps) {
  const { salesTotal, expectedCash } = useMemo(() => {
    let sales = 0;
    let other = 0;

    for (const m of movements) {
      if (m.type === "sale") {
        sales += m.amount;
      } else if (m.type === "refund") {
        other -= m.amount;
      } else if (m.type === "expense" || m.type === "cash_out") {
        other -= m.amount;
      } else if (m.type === "cash_in") {
        other += m.amount;
      }
    }

    const opening = shift.openingCash ?? 0;

    return {
      salesTotal: sales,
      expectedCash: opening + sales + other,
    };
  }, [movements, shift.openingCash]);

  const openedAt = shift.openedAt
    ? new Date(shift.openedAt).toLocaleTimeString()
    : "—";

  return (
    <div className="surface flex flex-wrap items-center justify-between gap-4 p-4">
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2">
          <User
            size={16}
            className="text-[var(--nebula-text-secondary)]"
          />
          <div>
            <p className="text-xs text-[var(--nebula-text-muted)]">
              Cashier
            </p>
            <p className="text-sm font-medium text-[var(--nebula-text-primary)]">
              {shift.cashierName || "—"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Clock
            size={16}
            className="text-[var(--nebula-text-secondary)]"
          />
          <div>
            <p className="text-xs text-[var(--nebula-text-muted)]">
              Started
            </p>
            <p className="text-sm font-medium text-[var(--nebula-text-primary)]">
              {openedAt}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Wallet
            size={16}
            className="text-[var(--nebula-text-secondary)]"
          />
          <div>
            <p className="text-xs text-[var(--nebula-text-muted)]">
              Opening Cash
            </p>
            <p className="text-sm font-medium text-[var(--nebula-text-primary)]">
              {formatCurrency(shift.openingCash ?? 0)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Banknote
            size={16}
            className="text-[var(--nebula-text-secondary)]"
          />
          <div>
            <p className="text-xs text-[var(--nebula-text-muted)]">
              Current Sales
            </p>
            <p className="text-sm font-medium text-[var(--nebula-text-primary)]">
              {formatCurrency(salesTotal)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Banknote
            size={16}
            className="text-[var(--nebula-primary)]"
          />
          <div>
            <p className="text-xs text-[var(--nebula-text-muted)]">
              Expected Cash
            </p>
            <p className="text-sm font-bold text-[var(--nebula-primary)]">
              {formatCurrency(expectedCash)}
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onCloseShift}
        className="rounded-lg border border-[var(--nebula-border)] px-4 py-2 text-sm font-semibold text-[var(--nebula-text-primary)] transition-colors hover:bg-[var(--nebula-surface)]"
      >
        Close Shift
      </button>
    </div>
  );
}
