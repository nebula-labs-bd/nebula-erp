import { useMemo, useState } from "react";

import { Loader2, Search, UserRound } from "lucide-react";

import { searchContacts, type ContactSearchResult } from "integrations/customer";

type ContactSelectorProps = {
  /** Selected contact id (or null for "unassigned"). */
  value: string | null;
  /** Called with the chosen contact id (null clears the selection). */
  onChange: (contactId: string | null, result?: ContactSearchResult) => void;
  /** Label shown above the selector. */
  label?: string;
  /** Restrict the displayed results to contacts holding one of these roles. */
  filterRoles?: ContactSearchResult["roles"];
  /** Placeholder shown when nothing is selected. */
  placeholder?: string;
};

const ROLE_LABELS: Record<string, string> = {
  customer: "Customer",
  vendor: "Vendor",
  partner: "Partner",
  other: "Other",
};

/**
 * Shared contact picker backed by the global Contact Registry.
 *
 * Uses `searchContacts` so the service desk (and any other module) links to
 * the same contact identity used across CRM, Sales and Finance — never a
 * duplicated copy.
 */
export default function ContactSelector({
  value,
  onChange,
  label = "Contact",
  filterRoles,
  placeholder = "Select a contact…",
}: ContactSelectorProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ContactSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search against the shared registry.
  useMemo(() => {
    const timeout = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const found = await searchContacts(query);
        setResults(found);
      } catch (error) {
        console.error("Failed to search contacts:", error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const visibleResults = useMemo(() => {
    if (!filterRoles || filterRoles.length === 0) {
      return results;
    }

    return results.filter((result) =>
      result.roles.some((role) => filterRoles.includes(role)),
    );
  }, [results, filterRoles]);

  const selected = value ? results.find((r) => r.id === value) ?? null : null;

  return (
    <div>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-[var(--nebula-text-secondary)]">
          {label}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex w-full items-center justify-between rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface)] px-3 py-2 text-left text-sm text-[var(--nebula-text-primary)] transition-colors hover:bg-[var(--nebula-surface-muted)]"
        >
          <span className="flex items-center gap-2">
            <UserRound size={16} className="text-[var(--nebula-text-secondary)]" />

            {selected ? (
              <span className="font-medium">{selected.name}</span>
            ) : (
              <span className="text-[var(--nebula-text-muted)]">{placeholder}</span>
            )}
          </span>
        </button>

        {open && (
          <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface)] shadow-[var(--nebula-shadow-md)]">
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--nebula-text-muted)]"
              />

              <input
                autoFocus
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search contacts…"
                className="w-full border-b border-[var(--nebula-border)] bg-transparent py-2 pl-9 pr-3 text-sm text-[var(--nebula-text-primary)] outline-none"
              />
            </div>

            <div className="max-h-64 overflow-y-auto">
              <button
                type="button"
                onClick={() => {
                  onChange(null);
                  setOpen(false);
                }}
                className="block w-full px-3 py-2 text-left text-sm text-[var(--nebula-text-muted)] transition-colors hover:bg-[var(--nebula-surface-muted)]"
              >
                None
              </button>

              {isSearching ? (
                <div className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--nebula-text-muted)]">
                  <Loader2 size={16} className="animate-spin" />
                  Searching…
                </div>
              ) : visibleResults.length === 0 ? (
                <div className="px-3 py-2 text-sm text-[var(--nebula-text-muted)]">
                  {query.trim() ? "No contacts found." : "Type to search…"}
                </div>
              ) : (
                visibleResults.map((result) => (
                  <button
                    key={result.id}
                    type="button"
                    onClick={() => {
                      onChange(result.id, result);
                      setOpen(false);
                    }}
                    className="block w-full px-3 py-2 text-left text-sm transition-colors hover:bg-[var(--nebula-surface-muted)]"
                  >
                    <span className="font-medium text-[var(--nebula-text-primary)]">
                      {result.name}
                    </span>

                    {result.companyName && (
                      <span className="ml-2 text-[var(--nebula-text-muted)]">
                        {result.companyName}
                      </span>
                    )}

                    {result.roles.length > 0 && (
                      <span className="ml-2 text-xs text-[var(--nebula-text-muted)]">
                        {result.roles
                          .map((role) => ROLE_LABELS[role] ?? role)
                          .join(", ")}
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
