/**
 * Dashboard format helpers.
 *
 * Local, dependency-free helpers used by the dashboard components to render
 * monetary figures and dates consistently with the rest of the app. Mirrors
 * `modules/reports/utils/format.ts` so the command center stays visually
 * aligned with the reporting module.
 */

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const compactFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

/** Format a numeric amount as a USD currency string. */
export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount ?? 0);
}

/** Format a numeric amount as a compact currency (e.g. $1.2M). */
export function formatCompactCurrency(amount: number): string {
  return `$${compactFormatter.format(amount ?? 0)}`;
}

/** Format an integer with thousands separators. */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value ?? 0);
}

/** Format an ISO timestamp as a short, human-friendly date + time. */
export function formatActivityDate(iso: string): string {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return iso;
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
