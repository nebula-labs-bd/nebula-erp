import { useMemo, useState } from "react";

import { Plus, X } from "lucide-react";

import { formatCurrency } from "../../dashboard/utils/format";

import type { Cart, POSCustomer } from "../types/pos.types";
import type {
  POSPayment,
  POSPaymentMethod,
} from "../types/transaction.types";

/** Order in which the register offers tender methods. Mirrors the task spec. */
const PAYMENT_METHODS: { value: POSPaymentMethod; label: string }[] = [
  { value: "cash", label: "Cash" },
  { value: "bank", label: "Bank" },
  { value: "card", label: "Card" },
  { value: "bkash", label: "bKash" },
  { value: "nagad", label: "Nagad" },
];

type POSPaymentPanelProps = {
  cart: Cart;
  customer: POSCustomer | null;
  onConfirm: (payments: POSPayment[]) => void;
  onCancel: () => void;
  /** Processing state passed from the parent (during sale creation). */
  processing?: boolean;
  /** Validation/error message from the parent. */
  error?: string | null;
};

let paymentSeq = 0;

function nextPaymentId(): string {
  paymentSeq += 1;
  return `pos-pay-${paymentSeq}`;
}

/**
 * POS payment panel.
 *
 * Supports split tender: the cashier selects a method, enters an amount, and
 * adds it to the list of payments. The panel tracks total paid and remaining
 * against the cart total. When the full amount is tendered, the parent is
 * notified via `onConfirm`. POS never owns payment logic — the tenders are
 * handed to the existing Payment service by the parent.
 */
export default function POSPaymentPanel({
  cart,
  customer,
  onConfirm,
  onCancel,
  processing = false,
  error = null,
}: POSPaymentPanelProps) {
  const [payments, setPayments] = useState<POSPayment[]>([]);
  const [method, setMethod] = useState<POSPaymentMethod>("cash");
  const [amount, setAmount] = useState<string>("");
  const [reference, setReference] = useState<string>("");

  const total = cart.total;

  const totalPaid = useMemo(
    () => payments.reduce((sum, p) => sum + p.amount, 0),
    [payments],
  );

  const remaining = Math.max(0, total - totalPaid);

  function addPayment() {
    const value = Number(amount);

    if (!value || value <= 0) {
      return;
    }

    setPayments((prev) => [
      ...prev,
      {
        id: nextPaymentId(),
        method,
        amount: Math.min(value, remaining > 0 ? remaining : value),
        reference: reference.trim() || undefined,
      },
    ]);

    setAmount("");
    setReference("");
  }

  function removePayment(id: string) {
    setPayments((prev) => prev.filter((p) => p.id !== id));
  }

  function handleConfirm() {
    if (remaining > 0.001) {
      return;
    }

    onConfirm(payments);
  }

  return (
    <div className="surface flex h-full flex-col p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--nebula-text-primary)]">
          Payment
        </h3>

        <button
          type="button"
          aria-label="Close payment panel"
          onClick={onCancel}
          disabled={processing}
          className="rounded-md p-1 text-[var(--nebula-text-muted)] transition-colors hover:text-[var(--nebula-danger)] disabled:opacity-50"
        >
          <X size={16} />
        </button>
      </div>

      {/* Running totals */}
      <dl className="mb-3 space-y-1 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-[var(--nebula-text-secondary)]">Total</dt>
          <dd className="font-semibold text-[var(--nebula-text-primary)]">
            {formatCurrency(total)}
          </dd>
        </div>

        <div className="flex items-center justify-between">
          <dt className="text-[var(--nebula-text-secondary)]">Paid</dt>
          <dd className="font-medium text-[var(--nebula-primary)]">
            {formatCurrency(totalPaid)}
          </dd>
        </div>

        <div className="flex items-center justify-between border-t border-[var(--nebula-border)] pt-1">
          <dt className="font-medium text-[var(--nebula-text-primary)]">
            Remaining
          </dt>
          <dd className="font-bold text-[var(--nebula-text-primary)]">
            {formatCurrency(remaining)}
          </dd>
        </div>
      </dl>

      {/* Tender entry */}
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          {PAYMENT_METHODS.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMethod(m.value)}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                method === m.value
                  ? "border-[var(--nebula-primary)] bg-[var(--nebula-primary)]/10 text-[var(--nebula-primary)]"
                  : "border-[var(--nebula-border)] text-[var(--nebula-text-secondary)] hover:bg-[var(--nebula-surface-muted)]"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <input
          type="number"
          min="0"
          step="0.01"
          placeholder={`Amount (${formatCurrency(remaining)} remaining)`}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface)] px-3 py-2 text-sm text-[var(--nebula-text-primary)] outline-none focus:border-[var(--nebula-primary)]"
        />

        <input
          type="text"
          placeholder="Reference (optional)"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          className="w-full rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface)] px-3 py-2 text-sm text-[var(--nebula-text-primary)] outline-none focus:border-[var(--nebula-primary)]"
        />

        <button
          type="button"
          onClick={addPayment}
          disabled={!amount || Number(amount) <= 0}
          className="flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-[var(--nebula-border)] px-3 py-2 text-sm text-[var(--nebula-text-secondary)] transition-colors hover:bg-[var(--nebula-surface-muted)] disabled:opacity-50"
        >
          <Plus size={14} /> Add Payment
        </button>
      </div>

      {/* Added tenders (split payment list) */}
      {payments.length > 0 && (
        <div className="mt-3 space-y-1">
          {payments.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-md border border-[var(--nebula-border)] px-3 py-2 text-sm"
            >
              <span className="capitalize text-[var(--nebula-text-primary)]">
                {p.method}
                {p.reference ? ` · ${p.reference}` : ""}
              </span>

              <span className="flex items-center gap-2">
                <span className="font-medium text-[var(--nebula-text-primary)]">
                  {formatCurrency(p.amount)}
                </span>

                <button
                  type="button"
                  aria-label={`Remove ${p.method} payment`}
                  onClick={() => removePayment(p.id)}
                  disabled={processing}
                  className="text-[var(--nebula-text-muted)] transition-colors hover:text-[var(--nebula-danger)] disabled:opacity-50"
                >
                  <X size={14} />
                </button>
              </span>
            </div>
          ))}

          <div className="flex items-center justify-between pt-1 text-sm font-semibold">
            <span>Total Paid</span>
            <span className="text-[var(--nebula-primary)]">
              {formatCurrency(totalPaid)}
            </span>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-3 rounded-md border border-red-300 bg-red-50 p-2 text-xs text-red-700">
          {error}
        </p>
      )}

      {customer && (
        <p className="mt-3 truncate text-xs text-[var(--nebula-text-muted)]">
          Selling to: {customer.name}
        </p>
      )}

      <button
        type="button"
        onClick={handleConfirm}
        disabled={remaining > 0.001 || processing || payments.length === 0}
        className="mt-4 w-full rounded-lg bg-[var(--nebula-primary)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--nebula-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {processing ? "Processing…" : "Confirm Payment"}
      </button>
    </div>
  );
}
