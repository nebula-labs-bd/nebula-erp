import { useMemo, useState } from "react";

import { X, CheckCircle2 } from "lucide-react";

import { formatCurrency } from "../../../dashboard/utils/format";

import { useShiftMutation } from "../hooks/useShift";

import type {
  CashMovement,
  POSShift,
} from "../types/shift.types";

/** Props for the close-shift reconciliation screen. */
type POSCloseShiftProps = {
  shift: POSShift;

  movements: CashMovement[];

  /** Called when the shift is closed (reconciliation complete). */
  onClosed: () => void;

  /** Dismiss the reconciliation screen without closing. */
  onCancel: () => void;
};

/**
 * Close Shift reconciliation screen.
 *
 * The cashier enters the physically counted closing cash. The breakdown
 * (opening, sales, refunds, expenses, expected, difference) is derived from
 * the shift's cash movements — POS operational logic only, no accounting or
 * inventory writes. On confirm the shift is closed with the counted amount.
 */
export default function POSCloseShift({
  shift,
  movements,
  onClosed,
  onCancel,
}: POSCloseShiftProps) {
  const { close } = useShiftMutation();

  const [counted, setCounted] = useState<string>(
    String(shift.closingCash ?? shift.openingCash ?? 0),
  );

  const { sales, refunds, expenses, cashIn, cashOut, expectedCash } =
    useMemo(() => {
      let s = 0;
      let r = 0;
      let e = 0;
      let ci = 0;
      let co = 0;

      for (const m of movements) {
        switch (m.type) {
          case "sale":
            s += m.amount;
            break;
          case "refund":
            r += m.amount;
            break;
          case "expense":
            e += m.amount;
            break;
          case "cash_in":
            ci += m.amount;
            break;
          case "cash_out":
            co += m.amount;
            break;
        }
      }

      const opening = shift.openingCash ?? 0;

      const expected = opening + s - r - e + ci - co;

      return {
        sales: s,
        refunds: r,
        expenses: e,
        cashIn: ci,
        cashOut: co,
        expectedCash: expected,
      };
    }, [movements, shift.openingCash]);

  const parsed = Number(counted);
  const countedCash = Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;

  const difference = countedCash - expectedCash;

  const handleClose = async () => {
    try {
      await close.mutateAsync({
        shiftId: shift.id,
        input: { closingCash: countedCash },
      });

      onClosed();
    } catch {
      // Error surfaced via `close.error` below.
    }
  };

  return (
    <div className="surface p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--nebula-text-primary)]">
          Close Shift — Reconcile Cash
        </h2>

        <button
          type="button"
          onClick={onCancel}
          className="text-[var(--nebula-text-muted)] transition-colors hover:text-[var(--nebula-text-primary)]"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>

      <dl className="space-y-2 text-sm">
        <Row label="Opening Cash" value={formatCurrency(shift.openingCash ?? 0)} />
        <Row label="Sales" value={formatCurrency(sales)} />
        <Row label="Refunds" value={`- ${formatCurrency(refunds)}`} />
        <Row label="Expenses" value={`- ${formatCurrency(expenses)}`} />
        <Row label="Cash In" value={formatCurrency(cashIn)} />
        <Row label="Cash Out" value={`- ${formatCurrency(cashOut)}`} />

        <div className="flex items-center justify-between border-t border-[var(--nebula-border)] pt-2">
          <dt className="text-base font-semibold text-[var(--nebula-text-primary)]">
            Expected Cash
          </dt>
          <dd className="text-base font-bold text-[var(--nebula-text-primary)]">
            {formatCurrency(expectedCash)}
          </dd>
        </div>
      </dl>

      <div className="mt-4">
        <label className="mb-1 block text-xs font-medium text-[var(--nebula-text-secondary)]">
          Actual Counted Cash
        </label>
        <input
          type="number"
          min={0}
          step="0.01"
          value={counted}
          onChange={(e) => setCounted(e.target.value)}
          className="w-full rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface)] px-3 py-2 text-sm text-[var(--nebula-text-primary)] outline-none focus:border-[var(--nebula-primary)]"
        />
      </div>

      <div
        className={`mt-3 rounded-lg border px-3 py-2 text-sm font-semibold ${
          Math.abs(difference) < 0.005
            ? "border-[var(--nebula-success)] text-[var(--nebula-success)]"
            : "border-[var(--nebula-danger)] text-[var(--nebula-danger)]"
        }`}
      >
        Difference: {formatCurrency(difference)}
      </div>

      {close.error && (
        <p className="mt-3 text-xs text-[var(--nebula-danger)]">
          Could not close shift. Please try again.
        </p>
      )}

      <button
        type="button"
        disabled={close.isPending}
        onClick={handleClose}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--nebula-primary)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--nebula-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <CheckCircle2 size={16} /> Close Shift
      </button>
    </div>
  );
}

/** Small label/value row used in the reconciliation breakdown. */
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-[var(--nebula-text-secondary)]">{label}</dt>
      <dd className="font-medium text-[var(--nebula-text-primary)]">
        {value}
      </dd>
    </div>
  );
}
