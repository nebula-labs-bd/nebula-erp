import { Printer } from "lucide-react";

import { formatCurrency } from "../../dashboard/utils/format";

import type { Cart, POSCustomer } from "../types/pos.types";
import type { POSTransactionResult } from "../services/pos.service";

type POSReceiptProps = {
  result: POSTransactionResult;
  cart: Cart;
  customer: POSCustomer | null;
  onClose: () => void;
};

/**
 * POS receipt foundation.
 *
 * Renders a read-only sale summary: business name, invoice number, date,
 * customer, line items, totals and the payment methods used. No printer
 * integration yet — the `Printer` action is a placeholder for a future print
 * step.
 */
export default function POSReceipt({
  result,
  cart,
  customer,
  onClose,
}: POSReceiptProps) {
  const { salesOrder, payments } = result;

  const date = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

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
          Nebula ERP
        </p>
        <p className="text-xs text-[var(--nebula-text-muted)]">
          Point of Sale Receipt
        </p>
      </div>

      <dl className="space-y-1 py-3 text-sm">
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
          <dt className="text-[var(--nebula-text-secondary)]">Discount</dt>
          <dd className="text-[var(--nebula-text-primary)]">
            {formatCurrency(cart.discount)}
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

      {/* Payment methods */}
      <div className="border-t border-[var(--nebula-border)] pt-3">
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[var(--nebula-text-muted)]">
          Paid via
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
