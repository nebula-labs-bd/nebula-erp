import { useMemo } from "react";

import { History, Loader2 } from "lucide-react";

import { formatCurrency } from "../../dashboard/utils/format";

import { useSalesOrders } from "../../sales/hooks/useSalesOrder";
import { usePayments } from "../../payments/hooks/usePayments";

type POSCustomerHistoryProps = {
  /** Selected customer id. */
  customerId: string | null;

  /** Selected customer display name. */
  customerName: string;
};

/**
 * Customer purchase history (read-only).
 *
 * Reuses the existing Sales + Payments data — the customer's invoices and the
 * payments settled against them — so the POS never duplicates receivables
 * logic. Shows previous purchases, total spent, and the outstanding balance
 * (invoiced total minus amounts received).
 */
export default function POSCustomerHistory({
  customerId,
  customerName,
}: POSCustomerHistoryProps) {
  const { data: orders = [], isLoading: ordersLoading } = useSalesOrders();
  const { data: payments = [], isLoading: paymentsLoading } =
    usePayments();

  const { purchases, totalSpent, outstanding } = useMemo(() => {
    if (!customerId) {
      return { purchases: [], totalSpent: 0, outstanding: 0 };
    }

    const customerOrders = orders.filter(
      (order) =>
        order.customerId === customerId &&
        order.status !== "draft" &&
        order.status !== "cancelled",
    );

    const spent = customerOrders.reduce(
      (sum, order) => sum + order.total,
      0,
    );

    const received = payments
      .filter(
        (payment) =>
          payment.partyId === customerId &&
          payment.type === "receivable",
      )
      .reduce((sum, payment) => sum + payment.amount, 0);

    return {
      purchases: [...customerOrders].sort((a, b) =>
        (b.date ?? "").localeCompare(a.date ?? ""),
      ),
      totalSpent: spent,
      outstanding: Math.max(0, spent - received),
    };
  }, [customerId, orders, payments]);

  const isLoading = ordersLoading || paymentsLoading;

  return (
    <div className="surface flex h-full flex-col p-4">
      <div className="mb-3 flex items-center gap-2">
        <History
          size={18}
          className="text-[var(--nebula-text-secondary)]"
        />
        <h3 className="text-sm font-semibold text-[var(--nebula-text-primary)]">
          Customer History
        </h3>
      </div>

      <p className="mb-3 truncate text-sm text-[var(--nebula-text-secondary)]">
        {customerName || "Walk-in customer"}
      </p>

      {isLoading ? (
        <p className="flex items-center gap-1 text-xs text-[var(--nebula-text-muted)]">
          <Loader2 size={12} className="animate-spin" /> Loading…
        </p>
      ) : !customerId ? (
        <p className="text-xs text-[var(--nebula-text-muted)]">
          Select a customer to view their history.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2">
            <Stat label="Orders" value={String(purchases.length)} />
            <Stat label="Total Spent" value={formatCurrency(totalSpent)} />
            <Stat
              label="Outstanding"
              value={formatCurrency(outstanding)}
              tone="warning"
            />
          </div>

          <div className="mt-4 flex-1 space-y-2 overflow-y-auto pr-1">
            {purchases.length === 0 ? (
              <p className="text-xs text-[var(--nebula-text-muted)]">
                No previous purchases.
              </p>
            ) : (
              purchases.map((order) => (
                <div
                  key={order.id}
                  className="rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[var(--nebula-text-primary)]">
                      {order.orderNumber}
                    </span>
                    <span className="text-sm font-semibold text-[var(--nebula-primary)]">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-[var(--nebula-text-muted)]">
                    {order.date
                      ? new Date(order.date).toLocaleDateString()
                      : "—"}{" "}
                    · {order.items.length} item(s) · {order.status}
                  </p>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "warning";
}) {
  return (
    <div className="rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-2 text-center">
      <p className="text-[10px] uppercase tracking-wide text-[var(--nebula-text-muted)]">
        {label}
      </p>
      <p
        className={`text-sm font-bold ${
          tone === "warning"
            ? "text-[var(--nebula-danger)]"
            : "text-[var(--nebula-text-primary)]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
