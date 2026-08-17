import type { LucideIcon } from "lucide-react";

import { formatCompactCurrency, formatCurrency } from "../utils/format";

export type MetricTone = "default" | "positive" | "negative" | "warning" | "info";

type MetricCardProps = {
  label: string;
  value: number;
  icon?: LucideIcon;
  tone?: MetricTone;
  /** Optional caption shown under the value (e.g. a sub-metric or helper). */
  hint?: string;
  /** Render the value in compact currency form (e.g. $1.2M) instead of full. */
  compact?: boolean;
};

function containerClass(tone: MetricTone): string {
  const base =
    "rounded-[var(--nebula-radius-lg)] border bg-[var(--nebula-surface)] p-5 shadow-[var(--nebula-shadow-sm)]";

  switch (tone) {
    case "positive":
      return `${base} border-[var(--nebula-success)]/30`;
    case "negative":
      return `${base} border-[var(--nebula-danger)]/30`;
    case "warning":
      return `${base} border-[var(--nebula-warning)]/30`;
    case "info":
      return `${base} border-[var(--nebula-info)]/30`;
    default:
      return `${base} border-[var(--nebula-border)]`;
  }
}

function iconClass(tone: MetricTone): string {
  const base = "rounded-[var(--nebula-radius-md)] p-2";

  switch (tone) {
    case "positive":
      return `${base} bg-[var(--nebula-success)]/10 text-[var(--nebula-success)]`;
    case "negative":
      return `${base} bg-[var(--nebula-danger)]/10 text-[var(--nebula-danger)]`;
    case "warning":
      return `${base} bg-[var(--nebula-warning)]/10 text-[var(--nebula-warning)]`;
    case "info":
      return `${base} bg-[var(--nebula-info)]/10 text-[var(--nebula-info)]`;
    default:
      return `${base} bg-[var(--nebula-surface-muted)] text-[var(--nebula-primary)]`;
  }
}

function valueClass(tone: MetricTone): string {
  const base = "mt-3 text-2xl font-bold text-[var(--nebula-text-primary)]";

  if (tone === "positive") {
    return `${base} text-[var(--nebula-success)]`;
  }

  if (tone === "negative") {
    return `${base} text-[var(--nebula-danger)]`;
  }

  return base;
}

function formatValue(value: number, compact?: boolean): string {
  return compact ? formatCompactCurrency(value) : formatCurrency(value);
}

/**
 * Reusable metric card used across the dashboard command center.
 *
 * Theme tokens drive every color, border and radius — no hardcoded palette.
 * Supports an optional leading icon (lucide-react) and a tone that maps to the
 * semantic status tokens defined in `styles/tokens.css`.
 */
export default function MetricCard({
  label,
  value,
  icon: Icon,
  tone = "default",
  hint,
  compact,
}: MetricCardProps) {
  return (
    <div className={containerClass(tone)}>
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-[var(--nebula-text-secondary)]">
          {label}
        </p>

        {Icon ? (
          <span className={iconClass(tone)}>
            <Icon
              size={18}
              strokeWidth={2}
              aria-hidden
            />
          </span>
        ) : null}
      </div>

      <p className={valueClass(tone)}>{formatValue(value, compact)}</p>

      {hint ? (
        <p className="mt-1 text-xs text-[var(--nebula-text-muted)]">{hint}</p>
      ) : null}
    </div>
  );
}
