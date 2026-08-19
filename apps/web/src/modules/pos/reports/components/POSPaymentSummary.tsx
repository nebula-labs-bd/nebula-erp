import { Loader2 } from "lucide-react";

import { formatCurrency } from "../../../dashboard/utils/format";

import { usePOSPaymentSummary } from "../hooks/usePOSReports";

import type { POSReportParams } from "../types/report.types";

type POSPaymentSummaryProps = {
  params: POSReportParams;
};

/**
 * POS Payment Summary card.
 * Read-only display of payment-method breakdown for the period.
 */
export default function POSPaymentSummary({ params }: POSPaymentSummaryProps) {
  const { data, isLoading, isError } = usePOSPaymentSummary(params);

  return (
    <div className="surface p-4">
      <h3 className="mb-3 text-sm font-semibold text-[var(--nebula-text-primary)]">
        Payment Summary
      </h3>

      {isLoading && (
        <p className="flex items-center gap-1 text-xs text-[var(--nebula-text-muted)]">
          <Loader2 size={12} className="animate-spin" /> Loading…
        </p>
      )}

      {isError && (
        <p className="text-xs text-[var(--nebula-danger)]">
          Failed to load payments.
        </p>
      )}

      {data && (
        <>
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs text-[var(--nebula-text-muted)]">
              Total Payments
            </span>
            <span className="text-sm font-semibold text-[var(--nebula-primary)]">
              {formatCurrency(data.totalPayments)}
            </span>
          </div>
          <div className="space-y-2">
            {data.methods.map((m) => (
              <div key={m.method}>
                <div className="flex items-center justify-between text-sm">
                  <span className="capitalize text-[var(--nebula-text-secondary)]">
                    {m.method}
                  </span>
                  <span className="text-[var(--nebula-text-primary)]">
                    {formatCurrency(m.total)} · {m.count}
                  </span>
                </div>
                <div className="mt-1 h-1.5 w-full rounded-full bg-[var(--nebula-surface-muted)]">
                  <div
                    className="h-1.5 rounded-full bg-[var(--nebula-primary)]"
                    style={{ width: `${Math.min(100, m.share)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
