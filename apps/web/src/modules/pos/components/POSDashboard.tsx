import { DollarSign, Receipt, RotateCcw, Clock } from "lucide-react";

import { formatCurrency } from "../../dashboard/utils/format";

import {
  usePOSDailySummary,
  usePOSTopProducts,
  usePOSPaymentSummary,
} from "../reports/hooks/usePOSReports";

import type { POSReportParams } from "../reports/types/report.types";
import type { POSShift } from "../shift/types/shift.types";

type POSDashboardProps = {
  /** Report query params (date / shift). */
  params: POSReportParams;

  /** Active shift the dashboard is scoped to (used for the "Current Shift" +
   * "Cash Balance" cards). Null when no shift is open. */
  shift: POSShift | null;

  /** Cash balance for the active shift (expected cash), if available. */
  cashBalance?: number;
};

/**
 * POS dashboard polish.
 *
 * Surfaces the day's POS performance through the existing read-only report
 * hooks (Daily Summary, Top Products, Payment Summary) plus the live shift
 * state. No analytics are computed here — everything is delegated to the
 * backend reports and the shift register.
 */
export default function POSDashboard({
  params,
  shift,
  cashBalance,
}: POSDashboardProps) {
  const { data: summary, isLoading: summaryLoading } =
    usePOSDailySummary(params);
  const { data: topProducts, isLoading: productsLoading } =
    usePOSTopProducts(params);
  const { data: paymentSummary, isLoading: paymentsLoading } =
    usePOSPaymentSummary(params);

  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi
          icon={<DollarSign size={18} />}
          label="Today's Sales"
          value={summaryLoading ? "—" : formatCurrency(summary?.totalSales ?? 0)}
        />
        <Kpi
          icon={<Receipt size={18} />}
          label="Transaction Count"
          value={summaryLoading ? "—" : String(summary?.transactionCount ?? 0)}
        />
        <Kpi
          icon={<RotateCcw size={18} />}
          label="Returns Today"
          value={
            summaryLoading ? "—" : formatCurrency(summary?.totalRefunds ?? 0)
          }
        />
        <Kpi
          icon={<Clock size={18} />}
          label="Current Shift"
          value={shift ? shift.cashierName || "Open" : "Closed"}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Today's sales + cash balance */}
        <div className="surface p-4">
          <h3 className="mb-3 text-sm font-semibold text-[var(--nebula-text-primary)]">
            Register
          </h3>

          {summaryLoading && (
            <p className="text-xs text-[var(--nebula-text-muted)]">Loading…</p>
          )}

          {summary && (
            <div className="space-y-2">
              <Row
                label="Net Sales"
                value={formatCurrency(summary.netSales)}
                bold
              />
              <Row
                label="Total Sales"
                value={formatCurrency(summary.totalSales)}
              />
              <Row
                label="Refunds"
                value={formatCurrency(summary.totalRefunds)}
              />
              <Row
                label="Transactions"
                value={String(summary.transactionCount)}
              />
              <Row
                label="Avg Sale"
                value={formatCurrency(summary.averageSale)}
              />
            </div>
          )}

          <div className="my-3 border-t border-[var(--nebula-border)]" />

          <Row
            label="Cash Balance"
            value={formatCurrency(cashBalance ?? shift?.openingCash ?? 0)}
            bold
            primary
          />
          {shift && (
            <p className="mt-1 text-xs text-[var(--nebula-text-muted)]">
              Shift {shift.id.slice(0, 8)} · opened{" "}
              {new Date(shift.openedAt).toLocaleTimeString()}
            </p>
          )}
        </div>

        {/* Top products */}
        <div className="surface p-4">
          <h3 className="mb-3 text-sm font-semibold text-[var(--nebula-text-primary)]">
            Top Products
          </h3>

          {productsLoading && (
            <p className="text-xs text-[var(--nebula-text-muted)]">Loading…</p>
          )}

          {topProducts && topProducts.length === 0 && (
            <p className="text-xs text-[var(--nebula-text-muted)]">
              No sales yet.
            </p>
          )}

          <div className="space-y-2">
            {(topProducts ?? []).slice(0, 5).map((product, idx) => (
              <div key={product.productId} className="flex items-center gap-3">
                <span className="w-5 text-right text-xs font-semibold text-[var(--nebula-text-muted)]">
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <p className="truncate text-sm text-[var(--nebula-text-primary)]">
                    {product.productName}
                  </p>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-[var(--nebula-surface-muted)]">
                    <div
                      className="h-1.5 rounded-full bg-[var(--nebula-primary)]"
                      style={{
                        width: `${Math.min(100, product.revenueShare)}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[var(--nebula-text-primary)]">
                    {formatCurrency(product.revenue)}
                  </p>
                  <p className="text-xs text-[var(--nebula-text-muted)]">
                    {product.quantitySold} units
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment breakdown */}
        <div className="surface p-4">
          <h3 className="mb-3 text-sm font-semibold text-[var(--nebula-text-primary)]">
            Payment Breakdown
          </h3>

          {paymentsLoading && (
            <p className="text-xs text-[var(--nebula-text-muted)]">Loading…</p>
          )}

          {paymentSummary && paymentSummary.methods.length === 0 && (
            <p className="text-xs text-[var(--nebula-text-muted)]">
              No payments yet.
            </p>
          )}

          {paymentSummary && (
            <>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs text-[var(--nebula-text-muted)]">
                  Total Payments
                </span>
                <span className="text-sm font-semibold text-[var(--nebula-primary)]">
                  {formatCurrency(paymentSummary.totalPayments)}
                </span>
              </div>
              <div className="space-y-2">
                {paymentSummary.methods.map((method) => (
                  <div key={method.method}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="capitalize text-[var(--nebula-text-secondary)]">
                        {method.method}
                      </span>
                      <span className="text-[var(--nebula-text-primary)]">
                        {formatCurrency(method.total)} · {method.count}
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-[var(--nebula-surface-muted)]">
                      <div
                        className="h-1.5 rounded-full bg-[var(--nebula-primary)]"
                        style={{ width: `${Math.min(100, method.share)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Kpi({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="surface p-4">
      <div className="mb-2 flex items-center gap-2 text-[var(--nebula-text-secondary)]">
        {icon}
        <span className="text-xs uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-xl font-bold text-[var(--nebula-text-primary)]">
        {value}
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  primary,
}: {
  label: string;
  value: string;
  bold?: boolean;
  primary?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-[var(--nebula-text-secondary)]">{label}</span>
      <span
        className={`${
          primary
            ? "text-base font-bold text-[var(--nebula-primary)]"
            : bold
              ? "font-semibold text-[var(--nebula-primary)]"
              : "text-[var(--nebula-text-primary)]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
