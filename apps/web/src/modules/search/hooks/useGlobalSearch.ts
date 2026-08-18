import { useQuery } from "@tanstack/react-query";

import { globalSearch } from "../services/search.service";
import { searchKeys } from "../queries/search.keys";

import type { SearchResult } from "../types/search.types";

/**
 * Global search hook — READ-ONLY data access.
 *
 * The search module never mutates source data, so this hook only exposes
 * `useQuery`. The query is disabled while the (trimmed) search term is
 * empty, so no request is fired until the user types something.
 */
export function useGlobalSearch(query: string) {
  const trimmed = query.trim();

  return useQuery<SearchResult[]>({
    queryKey: searchKeys.results(trimmed),
    queryFn: async () => {
      const response = await globalSearch(trimmed);

      return response.data;
    },
    enabled: trimmed.length > 0,
  });
}
