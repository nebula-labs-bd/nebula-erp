import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Package,
  Users,
  Building2,
  ShoppingCart,
  Receipt,
  Banknote,
  Wallet,
  Boxes,
  Search,
  CornerDownLeft,
  type LucideIcon,
} from "lucide-react";

import { useGlobalSearch } from "../hooks/useGlobalSearch";

import type { SearchResult, SearchType } from "../types/search.types";

/* Module presentation metadata — icon, label and accent tone per module. */
const MODULE_META: Record<
  SearchType,
  { icon: LucideIcon; label: string; tone: string }
> = {
  product: {
    icon: Package,
    label: "Products",
    tone: "bg-[var(--nebula-surface-muted)] text-[var(--nebula-primary)]",
  },
  customer: {
    icon: Users,
    label: "Customers",
    tone: "bg-[var(--nebula-info)]/10 text-[var(--nebula-info)]",
  },
  supplier: {
    icon: Building2,
    label: "Suppliers",
    tone: "bg-[var(--nebula-secondary)]/10 text-[var(--nebula-secondary)]",
  },
  sale: {
    icon: ShoppingCart,
    label: "Sales",
    tone: "bg-[var(--nebula-success)]/10 text-[var(--nebula-success)]",
  },
  purchase: {
    icon: Receipt,
    label: "Purchases",
    tone: "bg-[var(--nebula-warning)]/10 text-[var(--nebula-warning)]",
  },
  payment: {
    icon: Banknote,
    label: "Payments",
    tone: "bg-[var(--nebula-success)]/10 text-[var(--nebula-success)]",
  },
  expense: {
    icon: Wallet,
    label: "Expenses",
    tone: "bg-[var(--nebula-danger)]/10 text-[var(--nebula-danger)]",
  },
  asset: {
    icon: Boxes,
    label: "Assets",
    tone: "bg-[var(--nebula-surface-muted)] text-[var(--nebula-primary)]",
  },
};

/* Stable display order for grouped result sections. */
const MODULE_ORDER: SearchType[] = [
  "product",
  "customer",
  "supplier",
  "sale",
  "purchase",
  "payment",
  "expense",
  "asset",
];

function isMac(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }

  return /mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent);
}

/** Search trigger button shown in the application header. */
function SearchTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group nebula-search-focus flex h-10 w-full max-w-md items-center gap-3 rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface-muted)]/50 px-4 text-sm font-medium text-[var(--nebula-text-secondary)] transition-all duration-200 hover:border-[var(--nebula-primary)]/50 hover:bg-[var(--nebula-surface)] hover:shadow-[var(--nebula-shadow-md)] hover:shadow-[var(--nebula-primary)]/10 focus-visible:border-[var(--nebula-primary)] focus-visible:shadow-[var(--nebula-shadow-md)]"
      aria-label="Open global search"
    >
      <Search
        size={18}
        strokeWidth={2.25}
        className="text-[var(--nebula-text-muted)] transition-all duration-200 group-hover:scale-110 group-hover:text-[var(--nebula-primary)]"
        aria-hidden
      />

      <span className="flex-1 text-left font-semibold text-[var(--nebula-text-muted)] transition-colors group-hover:text-[var(--nebula-text-secondary)]">
        Search anything…
      </span>

      <kbd className="flex items-center gap-0.5 rounded-md border border-[var(--nebula-border)] bg-[var(--nebula-surface)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--nebula-text-muted)] shadow-sm transition-colors group-hover:border-[var(--nebula-primary)]/40 group-hover:text-[var(--nebula-primary)]">
        {isMac() ? "⌘" : "Ctrl"}+K
      </kbd>
    </button>
  );
}

/** Compact loading placeholder shown while a search request is in flight. */
function SearchSkeleton() {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="h-12 animate-pulse rounded-[var(--nebula-radius-md)] border border-[var(--nebula-border)] bg-[var(--nebula-surface)]"
        />
      ))}
    </div>
  );
}

/** Empty result state when a query returns nothing. */
function EmptyState({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center gap-2 p-10 text-center">
      <Search
        size={28}
        strokeWidth={1.5}
        className="text-[var(--nebula-text-muted)]"
        aria-hidden
      />

      <p className="text-sm font-medium text-[var(--nebula-text-primary)]">
        No results for &ldquo;{query}&rdquo;
      </p>

      <p className="max-w-xs text-xs text-[var(--nebula-text-secondary)]">
        Try a different term — search across products, customers, suppliers,
        sales, purchases, payments, expenses and assets.
      </p>
    </div>
  );
}

export default function GlobalSearch() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const { data, isFetching } = useGlobalSearch(query);

  /* Group results by module, preserving the stable module display order. */
  const groups = useMemo(() => {
    const byModule = new Map<SearchType, SearchResult[]>();

    (data ?? []).forEach((result) => {
      const list = byModule.get(result.module) ?? [];
      list.push(result);
      byModule.set(result.module, list);
    });

    return MODULE_ORDER.filter((module) => byModule.has(module)).map(
      (module) => ({
        module,
        items: byModule.get(module) ?? [],
      }),
    );
  }, [data]);

  /* Flattened list used for keyboard navigation. */
  const flatResults = useMemo(
    () => groups.flatMap((group) => group.items),
    [groups],
  );

  /* Global Ctrl/Cmd+K shortcut. */
  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    }

    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, []);

  /* Reset state and focus input when palette opens. */
  useEffect(() => {
    if (!open) {
      return;
    }

    setQuery("");
    setSelected(0);
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  /* Close on Escape or outside click. */
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    function handlePointerDown(event: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open]);

  /* Keep the active index in range. */
  useEffect(() => {
    setSelected((prev) =>
      flatResults.length === 0 ? 0 : Math.min(prev, flatResults.length - 1),
    );
  }, [flatResults.length]);

  function handleInputChange(value: string) {
    setQuery(value);
    setSelected(0);
  }

  function goTo(result: SearchResult | undefined) {
    if (!result) {
      return;
    }
    setOpen(false);
    navigate(result.url);
  }

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (flatResults.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelected((prev) => (prev + 1) % flatResults.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelected(
        (prev) => (prev - 1 + flatResults.length) % flatResults.length,
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      goTo(flatResults[selected]);
    }
  }

  const hasQuery = query.trim().length > 0;
  const isEmpty = hasQuery && !isFetching && flatResults.length === 0;

  return (
    <>
      <SearchTrigger onClick={() => setOpen(true)} />

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-[12vh]"
          role="dialog"
          aria-modal="true"
          aria-label="Global search"
        >
          <div
            ref={panelRef}
            className="w-full max-w-xl overflow-hidden rounded-[var(--nebula-radius-lg)] border border-[var(--nebula-border)] bg-[var(--nebula-surface)] shadow-[var(--nebula-shadow-lg)]"
            onKeyDown={handleListKeyDown}
          >
            {/* Search input */}
            <div className="flex items-center gap-2 border-b border-[var(--nebula-border)] px-4">
              <Search
                size={18}
                strokeWidth={2}
                className="text-[var(--nebula-text-muted)]"
                aria-hidden
              />

              <input
                ref={inputRef}
                value={query}
                onChange={(event) => handleInputChange(event.target.value)}
                placeholder="Search products, customers, sales, payments…"
                className="w-full bg-transparent py-3.5 text-sm text-[var(--nebula-text-primary)] outline-none placeholder:text-[var(--nebula-text-muted)]"
                aria-label="Search query"
              />

              <kbd className="rounded border border-[var(--nebula-border)] bg-[var(--nebula-surface-muted)] px-1.5 py-0.5 text-[11px] font-medium text-[var(--nebula-text-muted)]">
                Esc
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[55vh] overflow-y-auto">
              {isFetching && <SearchSkeleton />}

              {isEmpty && <EmptyState query={query.trim()} />}

              {!hasQuery && !isFetching && (
                <div className="p-10 text-center text-sm text-[var(--nebula-text-secondary)]">
                  Start typing to search across all modules.
                </div>
              )}

              {!isFetching &&
                !isEmpty &&
                flatResults.length > 0 &&
                groups.map((group) => {
                  const meta = MODULE_META[group.module];
                  const Icon = meta.icon;

                  return (
                    <div
                      key={group.module}
                      className="border-b border-[var(--nebula-border)] last:border-b-0"
                    >
                      <p className="px-4 pt-3 text-[11px] font-semibold uppercase tracking-wide text-[var(--nebula-text-muted)]">
                        {meta.label}
                      </p>

                      <ul className="p-2">
                        {group.items.map((item) => {
                          const index = flatResults.indexOf(item);
                          const active = index === selected;

                          return (
                            <li key={`${item.type}-${item.id}`}>
                              <button
                                type="button"
                                onMouseEnter={() => setSelected(index)}
                                onClick={() => goTo(item)}
                                className={`flex w-full items-center gap-3 rounded-[var(--nebula-radius-md)] px-2 py-2 text-left transition-colors ${
                                  active
                                    ? "bg-[var(--nebula-surface-muted)]"
                                    : "hover:bg-[var(--nebula-surface-muted)]"
                                }`}
                              >
                                <span
                                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${meta.tone}`}
                                >
                                  <Icon size={15} strokeWidth={2} aria-hidden />
                                </span>

                                <span className="min-w-0 flex-1">
                                  <span className="block truncate text-sm font-medium text-[var(--nebula-text-primary)]">
                                    {item.title}
                                  </span>
                                  <span className="block truncate text-xs text-[var(--nebula-text-secondary)]">
                                    {item.description}
                                  </span>
                                </span>

                                {active && (
                                  <CornerDownLeft
                                    size={14}
                                    className="shrink-0 text-[var(--nebula-text-muted)]"
                                    aria-hidden
                                  />
                                )}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
