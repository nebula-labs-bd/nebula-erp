import { RotateCcw, History, Percent, Gift, Receipt } from "lucide-react";

import type { POSCustomer } from "../types/pos.types";

type POSQuickActionsProps = {
  /** Currently selected customer (drives discount/loyalty/history actions). */
  customer: POSCustomer | null;

  /** Open the Return Sale flow (reuses the existing returns module). */
  onReturnSale: () => void;

  /** Open the customer purchase-history view (reuses Sales/Contacts data). */
  onCustomerHistory: () => void;

  /** Open the discount panel. */
  onApplyDiscount: () => void;

  /** Open the loyalty redemption panel. */
  onRedeemLoyalty: () => void;

  /** Show the most recent printed receipt (if one exists this session). */
  onRecentReceipts: () => void;

  /** Permission gate: when false (e.g. Cashier role) the Return Sale action is
   * hidden entirely, since refunds are manager-only. Defaults to visible. */
  canManageReturns?: boolean;
};

/**
 * Quick action rail for the POS sale workspace.
 *
 * Every action here opens an *existing* POS sub-feature — it never duplicates
 * logic. Discounts/loyalty require a selected customer; the buttons are
 * disabled (not hidden) when their precondition is missing so the cashier gets
 * clear, consistent affordances.
 */
export default function POSQuickActions({
  customer,
  onReturnSale,
  onCustomerHistory,
  onApplyDiscount,
  onRedeemLoyalty,
  onRecentReceipts,
  canManageReturns = true,
}: POSQuickActionsProps) {
  const needsCustomer = !customer;

  const actions = [
    {
      key: "return",
      label: "Return Sale",
      icon: RotateCcw,
      onClick: onReturnSale,
      disabled: false,
      hidden: !canManageReturns,
    },
    {
      key: "history",
      label: "Customer History",
      icon: History,
      onClick: onCustomerHistory,
      disabled: needsCustomer,
    },
    {
      key: "discount",
      label: "Apply Discount",
      icon: Percent,
      onClick: onApplyDiscount,
      disabled: false,
    },
    {
      key: "loyalty",
      label: "Redeem Loyalty",
      icon: Gift,
      onClick: onRedeemLoyalty,
      disabled: needsCustomer,
    },
    {
      key: "receipt",
      label: "Recent Receipts",
      icon: Receipt,
      onClick: onRecentReceipts,
      disabled: false,
    },
  ];

  return (
    <div className="surface p-4">
      <h3 className="mb-3 text-sm font-semibold text-[var(--nebula-text-primary)]">
        Quick Actions
      </h3>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {actions
          .filter((action) => !action.hidden)
          .map((action) => {
            const Icon = action.icon;

          return (
            <button
              key={action.key}
              type="button"
              disabled={action.disabled}
              onClick={action.onClick}
              className="flex flex-col items-center justify-center gap-1.5 rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface)] px-2 py-3 text-xs font-medium text-[var(--nebula-text-primary)] transition-colors hover:border-[var(--nebula-primary)] hover:text-[var(--nebula-primary)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon size={18} />
              {action.label}
            </button>
          );
        })}
      </div>

      {needsCustomer && (
        <p className="mt-2 text-xs text-[var(--nebula-text-muted)]">
          Select a customer to view history or redeem loyalty points.
        </p>
      )}
    </div>
  );
}
