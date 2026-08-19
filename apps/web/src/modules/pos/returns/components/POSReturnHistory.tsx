import { History, Loader2 } from "lucide-react";

import { formatCurrency } from "../../../dashboard/utils/format";

import { useReturnHistory } from "../hooks/useReturns";

/**
 * POS Return History panel.
 * Read-only list of processed POS returns, delegating to the return service.
 */
export default function POSReturnHistory() {
  const { data, isLoading, isError } = useReturnHistory();

  return (
    <div className="surface flex h-full flex-col p-4">
      <div className="mb-3 flex items-center gap-2">
        <History size={18} className="text-[var(--nebula-text-secondary)]" />
        <h3 className="text-sm font-semibold text-[var(--nebula-text-primary)]">
          Return History
        </h3>
      </div>

      {isLoading && (
        <p className="flex items-center gap-1 text-xs text-[var(--nebula-text-muted)]">
          <Loader2 size={12} className="animate-spin" /> Loading…
        </p>
      )}

      {isError && (
        <p className="text-xs text-[var(--nebula-danger)]">
          Failed to load returns.
        </p>
      )}

      {data && data.length === 0 && (
        <p className="text-xs text-[var(--nebula-text-muted)]">
          No returns yet.
        </p>
      )}

      <div className="flex-1 space-y-2 overflow-y-auto pr-1">
        {data?.map((ret) => (
          <div
            key={ret.salesOrderId}
            className="rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--nebula-text-primary)]">
                {ret.salesOrderNumber}
              </span>
              <span className="text-sm font-semibold text-[var(--nebula-primary)]">
                {formatCurrency(ret.total)}
              </span>
            </div>
            <p className="mt-1 text-xs text-[var(--nebula-text-muted)]">
              {ret.items.length} item(s) · {ret.reason}
            </p>
            <p className="mt-0.5 text-xs text-[var(--nebula-text-muted)]">
              Stock: {ret.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
