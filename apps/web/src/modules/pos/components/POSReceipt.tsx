import { Printer } from "lucide-react";

import { formatCurrency } from "../../dashboard/utils/format";

import type { Cart, POSCustomer } from "../types/pos.types";
import type { POSTransactionResult } from "../services/pos.service";
import type { POSShift } from "../shift/types/shift.types";

type POSReceiptProps = {
  result: POSTransactionResult;
  cart: Cart;
  customer: POSCustomer | null;
  onClose: () => void;

  /** Cashier display name (from the active user / shift). */
  cashierName?: string;

  /** Active shift the sale belongs to (POS register metadata). */
  shift?: POSShift | null;

  /** Human-readable receipt number. Falls back to the sales order number. */
  receiptNumber?: string;

  /** Loyalty points earned by the customer on this sale (display only). */
  pointsEarned?: number;

  /** Loyalty discount (currency) applied on this sale, if any. */
  loyaltyDiscount?: number;

  /** Business details for the receipt header. */
  businessName?: string;
  businessAddress?: string;
};

/**
 * POS receipt foundation.
 *
 * Renders a professional, print-ready sale summary:
 *   - Business information (name + address)
 *   - Receipt number + date/time
 *   - Cashier + shift reference (POS register metadata)
 *   - Customer
 *   - Line items
 *   - Payment methods
 *   - Totals + fulfilment status
 *
 * No hardware integration yet — the `Printer` action triggers the browser print
 * dialog (`window.print()`), which is the foundation for the thermal / 80mm
 * print step implemented in `POSPrintReceipt`.
 */
export default function POSReceipt({
  result,
  cart,
  customer,
  onClose,
  cashierName,
  shift,
  receiptNumber,
  pointsEarned,
  loyaltyDiscount = 0,
  businessName = "Nebula ERP",
  businessAddress = "123 Galaxy Road, Dhaka, Bangladesh",
}: POSReceiptProps) {
  const { salesOrder, payments } = result;

  const issuedAt = new Date();

  const date = issuedAt.toLocaleDateString("en-US", {
    dateStyle: "medium",
  });

  const time = issuedAt.toLocaleTimeString("en-US", {
    timeStyle: "short",
  });

  const receipt = receiptNumber ?? salesOrder.orderNumber;

  return (
    <div className="surface flex h-full flex-col p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--nebula-text-primary)]">
          Receipt
        </h3>

        <button
          type="button"
          onClick={onClose}
          className="rounded-md px-3 py-1.5 text-sm text-[var(--nebula-text-secondary)] transition-colors hover:bg-[var(--nebula-surface-muted)]"
        >
          New Sale
        </button>
      </div>

      {/* Business + invoice header */}
      <div className="border-b border-[var(--nebula-border)] pb-3 text-center">
        <p className="text-base font-bold text-[var(--nebula-text-primary)]">
          {businessName}
        </p>
        <p className="text-xs text-[var(--nebula-text-muted)]">
          {businessAddress}
        </p>
        <p className="mt-1 text-xs text-[var(--nebula-text-muted)]">
          Point of Sale Receipt
        </p>
      </div>

      <dl className="space-y-1 py-3 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-[var(--nebula-text-secondary)]">Receipt #</dt>
          <dd className="font-medium text-[var(--nebula-text-primary)]">
            {receipt}
          </dd>
        </div>

        <div className="flex items-center justify-between">
          <dt className="text-[var(--nebula-text-secondary)]">Invoice #</dt>
          <dd className="font-medium text-[var(--nebula-text-primary)]">
            {salesOrder.orderNumber}
          </dd>
        </div>

        <div className="flex items-center justify-between">
          <dt className="text-[var(--nebula-text-secondary)]">Date</dt>
          <dd className="text-[var(--nebula-text-primary)]">{date}</dd>
        </div>

        <div className="flex items-center justify-between">
          <dt className="text-[var(--nebula-text-secondary)]">Time</dt>
          <dd className="text-[var(--nebula-text-primary)]">{time}</dd>
        </div>

        <div className="flex items-center justify-between">
          <dt className="text-[var(--nebula-text-secondary)]">Cashier</dt>
          <dd className="truncate text-[var(--nebula-text-primary)]">
            {cashierName ?? shift?.cashierName ?? "—"}
          </dd>
        </div>

        <div className="flex items-center justify-between">
          <dt className="text-[var(--nebula-text-secondary)]">Shift #</dt>
          <dd className="truncate text-[var(--nebula-text-primary)]">
            {shift ? shift.id.slice(0, 8) : "—"}
          </dd>
        </div>

        {customer && (
          <div className="flex items-center justify-between">
            <dt className="text-[var(--nebula-text-secondary)]">
              Points Earned
            </dt>
            <dd className="truncate font-medium text-[var(--nebula-success)]">
              {pointsEarned ?? 0} pts
            </dd>
          </div>
        )}

        <div className="flex items-center justify-between">
          <dt className="text-[var(--nebula-text-secondary)]">Customer</dt>
          <dd className="truncate text-[var(--nebula-text-primary)]">
            {customer?.name ?? "Walk-in"}
          </dd>
        </div>

        <div className="flex items-center justify-between">
          <dt className="text-[var(--nebula-text-secondary)]">Delivery</dt>
          <dd className="max-w-[60%] truncate text-right font-medium text-[var(--nebula-text-primary)]">
            {result.deliveryId
              ? result.deliveryId
              : "—"}
          </dd>
        </div>
      </dl>

      {/* Items */}
      <div className="flex-1 space-y-2 overflow-y-auto border-t border-[var(--nebula-border)] py-3">
        {cart.items.map((item) => (
          <div
            key={item.id}
            className="flex items-start justify-between gap-2 text-sm"
          >
            <div className="min-w-0">
              <div className="truncate font-medium text-[var(--nebula-text-primary)]">
                {item.name}
              </div>
              <div className="text-xs text-[var(--nebula-text-muted)]">
                {item.sku}
                {item.barcode ? ` · ${item.barcode}` : ""} ·{" "}
                {item.quantity} × {formatCurrency(item.unitPrice)}
              </div>
            </div>
            <span className="shrink-0 font-medium text-[var(--nebula-text-primary)]">
              {formatCurrency(item.subtotal)}
            </span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <dl className="space-y-1 border-t border-[var(--nebula-border)] py-3 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-[var(--nebula-text-secondary)]">Subtotal</dt>
          <dd className="text-[var(--nebula-text-primary)]">
            {formatCurrency(cart.subtotal)}
          </dd>
        </div>

        <div className="flex items-center justify-between">
          <dt className="text-[var(--nebula-text-secondary)]">Tax</dt>
          <dd className="text-[var(--nebula-text-primary)]">
            {formatCurrency(cart.tax)}
          </dd>
        </div>

        <div className="flex items-center justify-between">
          <dt className="text-[var(--nebula-text-secondary)]">
            Discount Applied
          </dt>
          <dd className="text-[var(--nebula-text-primary)]">
            {formatCurrency(cart.discount + loyaltyDiscount)}
          </dd>
        </div>

        <div className="flex items-center justify-between border-t border-[var(--nebula-border)] pt-1">
          <dt className="text-base font-semibold text-[var(--nebula-text-primary)]">
            Total
          </dt>
          <dd className="text-base font-bold text-[var(--nebula-primary)]">
            {formatCurrency(cart.total)}
          </dd>
        </div>
      </dl>

      {/* Fulfilment status: payment + stock movement */}
      <div className="space-y-1 border-t border-[var(--nebula-border)] py-3 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-[var(--nebula-text-secondary)]">Payment</dt>
          <dd className="font-medium text-[var(--nebula-success)]">
            Completed
          </dd>
        </div>

        <div className="flex items-center justify-between">
          <dt className="text-[var(--nebula-text-secondary)]">Stock</dt>
          <dd
            className={
              result.stockMovementStatus === "completed"
                ? "font-medium capitalize text-[var(--nebula-success)]"
                : result.stockMovementStatus === "failed"
                  ? "font-medium capitalize text-[var(--nebula-danger)]"
                  : "font-medium capitalize text-[var(--nebula-text-secondary)]"
            }
          >
            {result.stockMovementStatus}
          </dd>
        </div>
      </div>

      {result.warning && (
        <div className="rounded-md border border-amber-300 bg-amber-50 p-2 text-xs text-amber-800">
          {result.warning}
        </div>
      )}

      {/* Payment breakdown */}
      <div className="border-t border-[var(--nebula-border)] pt-3">
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[var(--nebula-text-muted)]">
          Payment Breakdown
        </p>
        <div className="space-y-1">
          {payments.map((payment, index) => (
            <div
              key={index}
              className="flex items-center justify-between text-sm"
            >
              <span className="capitalize text-[var(--nebula-text-primary)]">
                {payment.method}
                {payment.reference ? ` · ${payment.reference}` : ""}
              </span>
              <span className="font-medium text-[var(--nebula-text-primary)]">
                {formatCurrency(payment.amount)}
              </span>
            </div>
          ))}

          <div className="flex items-center justify-between border-t border-[var(--nebula-border)] pt-1 text-sm font-semibold">
            <span className="text-[var(--nebula-text-primary)]">Total</span>
            <span className="text-[var(--nebula-primary)]">
              {formatCurrency(
                payments.reduce((sum, p) => sum + p.amount, 0),
              )}
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => window.print()}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--nebula-border)] px-4 py-2.5 text-sm font-semibold text-[var(--nebula-text-primary)] transition-colors hover:bg-[var(--nebula-surface-muted)]"
      >
        <Printer size={16} /> Print Receipt
      </button>
    </div>
  );
}
