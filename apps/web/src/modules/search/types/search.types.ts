/**
 * Global Search — domain types.
 *
 * Shared platform feature that lets users find records across every ERP
 * module from a single command palette. This module is strictly READ-ONLY:
 * `globalSearch` issues a GET request against `/search` and never creates
 * or mutates any underlying record (inventory, sales, accounting, etc.).
 */

/* ------------------------------------------------------------------ */
/* Search Type                                                         */
/* ------------------------------------------------------------------ */

/**
 * Every kind of entity the global search can return, and the module it
 * belongs to. The `module` field on a result mirrors one of these values
 * so results can be grouped by their owning module in the palette.
 */
export type SearchType =
  | "product"
  | "customer"
  | "supplier"
  | "sale"
  | "purchase"
  | "payment"
  | "expense"
  | "asset";

/* ------------------------------------------------------------------ */
/* Search Result                                                       */
/* ------------------------------------------------------------------ */

export interface SearchResult {
  /** Stable identifier of the underlying record. */
  id: string;

  /** Kind of entity (matches {@link SearchType}). */
  type: SearchType;

  /** Human-readable primary label (e.g. product name, invoice number). */
  title: string;

  /** Secondary context (e.g. customer name, amount, status). */
  description: string;

  /** Owning module, used to group results in the palette UI. */
  module: SearchType;

  /** Route the user is navigated to when selecting the result. */
  url: string;
}
