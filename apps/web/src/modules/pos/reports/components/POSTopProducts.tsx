import { Loader2 } from "lucide-react";

import { formatCurrency } from "../../../dashboard/utils/format";

import { usePOSTopProducts } from "../hooks/usePOSReports";

import type { POSReportParams } from "../types/report.types";

type POSTopProductsProps = {
  params: POSReportParams;
  /** Max number of products to display. */
  limit?: number;
};

/**
 * POS Top Products card.
 * Read-only display of best-selling products by revenue.
 */
export default function POSTopProducts({ params, limit = 5 }: POSTopProductsProps) {
  const { data, isLoading, isError } = usePOSTopProducts(params);

  const top = (data ?? []).slice(0, limit);

  return (
    <div className="surface p-4">
      <h3 className="mb-3 text-sm font-semibold text-[var(--nebula-text-primary)]">
        Top Products
      </h3>

      {isLoading && (
        <p className="flex items-center gap-1 text-xs text-[var(--nebula-text-muted)]">
          <Loader2 size={12} className="animate-spin" /> Loading…
        </p>
      )}

      {isError && (
        <p className="text-xs text-[var(--nebula-danger)]">
          Failed to load products.
        </p>
      )}

      {data && data.length === 0 && (
        <p className="text-xs text-[var(--nebula-text-muted)]">No sales yet.</p>
      )}

      <div className="space-y-2">
        {top.map((p, idx) => (
          <div key={p.productId} className="flex items-center gap-3">
            <span className="w-5 text-right text-xs font-semibold text-[var(--nebula-text-muted)]">
              {idx + 1}
            </span>
            <div className="flex-1">
              <p className="truncate text-sm text-[var(--nebula-text-primary)]">
                {p.productName}
              </p>
              <div className="mt-1 h-1.5 w-full rounded-full bg-[var(--nebula-surface-muted)]">
                <div
                  className="h-1.5 rounded-full bg-[var(--nebula-primary)]"
                  style={{ width: `${Math.min(100, p.revenueShare)}%` }}
                />
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-[var(--nebula-text-primary)]">
                {formatCurrency(p.revenue)}
              </p>
              <p className="text-xs text-[var(--nebula-text-muted)]">
                {p.quantitySold} units
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
