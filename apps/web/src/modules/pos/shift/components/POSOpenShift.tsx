import { useState } from "react";

import { Wallet, Play } from "lucide-react";

import { formatCurrency } from "../../../dashboard/utils/format";

import { useShiftMutation } from "../hooks/useShift";

/** Props for the open-shift screen. */
type POSOpenShiftProps = {
  /** Display name of the signed-in cashier. */
  cashierName: string;

  /** Called after a shift is opened successfully. */
  onOpened?: () => void;
};

/**
 * Open Shift screen.
 *
 * Shown before any selling is allowed. The cashier counts the opening float
 * into the register and starts the shift. POS operational logic only — this
 * never touches accounting or inventory.
 */
export default function POSOpenShift({
  cashierName,
  onOpened,
}: POSOpenShiftProps) {
  const { open } = useShiftMutation();

  const [openingCash, setOpeningCash] = useState<string>("0");

  const parsed = Number(openingCash);

  const amount = Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;

  const handleStart = async () => {
    try {
      await open.mutateAsync({
        openingCash: amount,
        cashierName,
      });

      onOpened?.();
    } catch {
      // Error surfaced via `open.error` below.
    }
  };

  return (
    <div className="surface flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="mb-4 flex items-center gap-2">
          <Wallet
            size={20}
            className="text-[var(--nebula-primary)]"
          />

          <h2 className="text-lg font-semibold text-[var(--nebula-text-primary)]">
            Open Cash Register
          </h2>
        </div>

        <p className="mb-4 text-sm text-[var(--nebula-text-secondary)]">
          {cashierName
            ? `Welcome, ${cashierName}. Count the opening cash float to start your shift.`
            : "Count the opening cash float to start your shift."}
        </p>

        <label className="mb-1 block text-xs font-medium text-[var(--nebula-text-secondary)]">
          Opening Cash
        </label>
        <input
          type="number"
          min={0}
          step="0.01"
          value={openingCash}
          onChange={(e) => setOpeningCash(e.target.value)}
          className="w-full rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface)] px-3 py-2 text-sm text-[var(--nebula-text-primary)] outline-none focus:border-[var(--nebula-primary)]"
          placeholder="0.00"
        />

        <p className="mt-2 text-xs text-[var(--nebula-text-muted)]">
          Opening float: {formatCurrency(amount)}
        </p>

        {open.error && (
          <p className="mt-3 text-xs text-[var(--nebula-danger)]">
            {open.error.message || "Could not open shift. Please try again."}
          </p>
        )}

        <button
          type="button"
          disabled={open.isPending}
          onClick={handleStart}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--nebula-primary)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--nebula-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Play size={16} /> Start Shift
        </button>
      </div>
    </div>
  );
}
