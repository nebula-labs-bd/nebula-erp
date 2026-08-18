import { Receipt, CreditCard } from "lucide-react";

import { formatCurrency } from "../../dashboard/utils/format";

import type { Cart, POSCustomer } from "../types/pos.types";

type POSCheckoutProps = {
  cart: Cart;

  customer: POSCustomer | null;

  /** Disabled state (e.g. empty cart). */
  disabled?: boolean;

  /** Open the payment panel (hand-off to the Payment step). */
  onCompleteSale: () => void;
};

/**
 * Checkout summary for the POS workspace.
 *
 * This is the first step of the real checkout flow:
 *
 *   Complete Sale → Open Payment Panel → Confirm Payment → Create Transaction
 *
 * The "Complete Sale" button no longer navigates away. It opens the payment
 * panel orchestrated by the parent, which then creates the sale via the Sales
 * module (source of truth) and posts payments through the Payment module.
 */
export default function POSCheckout({
  cart,
  customer,
  disabled = false,
  onCompleteSale,
}: POSCheckoutProps) {
  const hasItems = cart.items.length > 0;

  return (
    <div className="surface p-4">
      <div className="mb-3 flex items-center gap-2">
        <Receipt
          size={18}
          className="text-[var(--nebula-text-secondary)]"
        />

        <h3 className="text-sm font-semibold text-[var(--nebula-text-primary)]">
          Checkout
        </h3>
      </div>

      <dl className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-[var(--nebula-text-secondary)]">
            Subtotal
          </dt>

          <dd className="font-medium text-[var(--nebula-text-primary)]">
            {formatCurrency(cart.subtotal)}
          </dd>
        </div>

        <div className="flex items-center justify-between">
          <dt className="text-[var(--nebula-text-secondary)]">
            Discount
          </dt>

          <dd className="font-medium text-[var(--nebula-text-primary)]">
            {formatCurrency(cart.discount)}
          </dd>
        </div>

        <div className="flex items-center justify-between">
          <dt className="text-[var(--nebula-text-secondary)]">
            Tax
          </dt>

          <dd className="font-medium text-[var(--nebula-text-primary)]">
            {formatCurrency(cart.tax)}
          </dd>
        </div>

        <div className="flex items-center justify-between border-t border-[var(--nebula-border)] pt-2">
          <dt className="text-base font-semibold text-[var(--nebula-text-primary)]">
            Total
          </dt>

          <dd className="text-base font-bold text-[var(--nebula-primary)]">
            {formatCurrency(cart.total)}
          </dd>
        </div>
      </dl>

      {customer && (
        <p className="mt-3 truncate text-xs text-[var(--nebula-text-muted)]">
          Selling to: {customer.name}
        </p>
      )}

      <button
        type="button"
        disabled={disabled || !hasItems}
        onClick={onCompleteSale}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--nebula-primary)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--nebula-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <CreditCard size={16} /> Complete Sale
      </button>
    </div>
  );
}
