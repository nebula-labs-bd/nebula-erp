/**
 * Reporting format helpers.
 *
 * Local, dependency-free helpers used by the report components to render
 * monetary figures consistently. No external libraries are introduced.
 */

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Format a numeric amount as a USD currency string. */
export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount ?? 0);
}

/** Format a numeric amount with an explicit +/- sign prefix. */
export function formatSignedCurrency(amount: number): string {
  const sign = amount < 0 ? "-" : amount > 0 ? "+" : "";
  return `${sign}${formatCurrency(Math.abs(amount))}`;
}
