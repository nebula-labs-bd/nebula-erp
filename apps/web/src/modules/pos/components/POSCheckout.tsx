import { Receipt, CreditCard, Percent, Gift } from "lucide-react";

import { formatCurrency } from "../../dashboard/utils/format";

import type { Warehouse } from "../../inventory/types/inventory.types";

import type { Cart, POSCustomer } from "../types/pos.types";

type POSCheckoutProps = {
  cart: Cart;

  customer: POSCustomer | null;

  /** Warehouse the sale is fulfilled from (drives the delivery/stock step). */
  warehouseId: string;

  /** Available warehouses for fulfilment. */
  warehouses: Warehouse[];

  /** Called when the cashier changes the fulfilment warehouse. */
  onWarehouseChange: (warehouseId: string) => void;

  /** Disabled state (e.g. empty cart). */
  disabled?: boolean;

  /** Open the payment panel (hand-off to the Payment step). */
  onCompleteSale: () => void;

  /** Manually applied discount (currency), folded into the displayed total. */
  appliedDiscount?: number;

  /** Loyalty discount (currency) redeemed against this sale. */
  loyaltyDiscount?: number;

  /** Open the discount panel. */
  onApplyDiscount?: () => void;

  /** Open the loyalty redemption panel. */
  onRedeemLoyalty?: () => void;
};

/**
 * Checkout summary for the POS workspace.
 *
 * This is the first step of the real checkout flow:
 *
 *   Warehouse → Complete Sale → Open Payment Panel → Confirm →
 *     Sales + Payments + Delivery + Stock Movement
 *
 * The "Complete Sale" button no longer navigates away. It opens the payment
 * panel orchestrated by the parent, which then creates the sale via the Sales
 * module (source of truth), posts payments through the Payment module, and
 * drives the delivery/stock movement through the existing Sales flow.
 */
export default function POSCheckout({
  cart,
  customer,
  warehouseId,
  warehouses,
  onWarehouseChange,
  disabled = false,
  onCompleteSale,
  appliedDiscount = 0,
  loyaltyDiscount = 0,
  onApplyDiscount,
  onRedeemLoyalty,
}: POSCheckoutProps) {
  const hasItems = cart.items.length > 0;

  const hasWarehouse = Boolean(warehouseId);

  // Grand total folds in the manual discount and any redeemed loyalty value
  // so the cashier sees the exact amount that will be tendered.
  const grandTotal = Math.max(
    0,
    cart.subtotal - cart.discount - appliedDiscount - loyaltyDiscount + cart.tax,
  );

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

      {/* Discount + Loyalty quick actions */}
      <div className="mb-3 flex gap-2">
        <button
          type="button"
          onClick={onApplyDiscount}
          disabled={!hasItems || !onApplyDiscount}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[var(--nebula-border)] px-2 py-2 text-xs font-medium text-[var(--nebula-text-secondary)] transition-colors hover:border-[var(--nebula-primary)] hover:text-[var(--nebula-primary)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Percent size={14} /> Apply Discount
        </button>

        <button
          type="button"
          onClick={onRedeemLoyalty}
          disabled={!hasItems || !customer || !onRedeemLoyalty}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[var(--nebula-border)] px-2 py-2 text-xs font-medium text-[var(--nebula-text-secondary)] transition-colors hover:border-[var(--nebula-primary)] hover:text-[var(--nebula-primary)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Gift size={14} /> Redeem Points
        </button>
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
            {formatCurrency(cart.discount + appliedDiscount)}
          </dd>
        </div>

        <div className="flex items-center justify-between">
          <dt className="text-[var(--nebula-text-secondary)]">
            Loyalty Discount
          </dt>

          <dd className="font-medium text-[var(--nebula-success)]">
            {formatCurrency(loyaltyDiscount)}
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
            Grand Total
          </dt>

          <dd className="text-base font-bold text-[var(--nebula-primary)]">
            {formatCurrency(grandTotal)}
          </dd>
        </div>
      </dl>

      {/* Fulfilment warehouse — required to drive the delivery + stock-out */}
      <div className="mt-3">
        <label className="mb-1 block text-xs font-medium text-[var(--nebula-text-secondary)]">
          Fulfil from Warehouse
        </label>
        <select
          value={warehouseId}
          onChange={(e) => onWarehouseChange(e.target.value)}
          className="w-full rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface)] px-3 py-2 text-sm text-[var(--nebula-text-primary)] outline-none focus:border-[var(--nebula-primary)]"
        >
          <option value="">Select warehouse…</option>
          {warehouses.map((warehouse) => (
            <option key={warehouse.id} value={warehouse.id}>
              {warehouse.name}
            </option>
          ))}
        </select>
        {!hasWarehouse && (
          <p className="mt-1 text-xs text-[var(--nebula-text-muted)]">
            Select a warehouse to enable fulfilment.
          </p>
        )}
      </div>

      {customer && (
        <p className="mt-3 truncate text-xs text-[var(--nebula-text-muted)]">
          Selling to: {customer.name}
        </p>
      )}

      <button
        type="button"
        disabled={disabled || !hasItems || !hasWarehouse}
        onClick={onCompleteSale}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--nebula-primary)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--nebula-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <CreditCard size={16} /> Complete Sale
      </button>
    </div>
  );
}
