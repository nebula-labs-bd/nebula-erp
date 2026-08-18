import { apiClient } from "../../../api/client";

import type { SearchResult } from "../types/search.types";

/**
 * Global Search service — READ-ONLY by design.
 *
 * Every function issues a GET request against the search API and never
 * creates or mutates any underlying ERP record (inventory, stock, sales,
 * payments, accounting, etc.).
 */

/** Run a cross-module search for the given free-text query. */
export function globalSearch(query: string) {
  const params = new URLSearchParams({ q: query });

  return apiClient.get<SearchResult[]>(`/search?${params.toString()}`);
}
