import { useMemo, useState } from "react";

import { Search } from "lucide-react";

import { useProducts } from "../../inventory/hooks/useProducts";

import { formatCurrency } from "../../dashboard/utils/format";

import type {
  POSProductInput,
} from "../hooks/usePOSCart";

type POSProductSearchProps = {
  /** Called when a product is clicked/selected to add it to the cart. */
  onSelectProduct: (product: POSProductInput) => void;
};

/**
 * Product search panel for the POS workspace.
 *
 * Reuses the existing Inventory `useProducts` query (single source of product
 * truth) and renders a searchable, responsive grid of products. Clicking a
 * product forwards it to the parent cart handler.
 */
export default function POSProductSearch({
  onSelectProduct,
}: POSProductSearchProps) {
  const { data: products = [], isLoading } = useProducts();

  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();

    if (!term) {
      return products;
    }

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.sku.toLowerCase().includes(term),
    );
  }, [products, query]);

  return (
    <div className="surface flex h-full flex-col p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">
          Products
        </h2>

        <p className="text-sm text-[var(--nebula-text-muted)]">
          Search and tap to add to the cart.
        </p>
      </div>

      <div className="relative mb-4">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--nebula-text-muted)]"
          size={18}
        />

        <input
          className="w-full rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface)] py-2 pl-10 pr-3 text-sm text-[var(--nebula-text-primary)] outline-none focus:border-[var(--nebula-primary)]"
          placeholder="Search by name or SKU"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto pr-1">
        {isLoading ? (
          <div className="p-6 text-center text-sm text-[var(--nebula-text-muted)]">
            Loading products…
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-6 text-center text-sm text-[var(--nebula-text-muted)]">
            No products found.
          </div>
        ) : (
          filtered.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() =>
                onSelectProduct({
                  id: product.id,
                  name: product.name,
                  sku: product.sku,
                  sellingPrice: product.sellingPrice,
                  taxRate: product.taxRate,
                })
              }
              className="flex w-full items-center gap-3 rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-3 text-left transition-colors hover:bg-[var(--nebula-surface-muted)]"
            >
              {/* Image placeholder — products may have images, but POS keeps a
                  consistent placeholder to stay lightweight. */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[var(--nebula-surface-muted)] text-[var(--nebula-text-muted)]">
                <span className="text-xs font-semibold">
                  {product.name.slice(0, 2).toUpperCase()}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="truncate font-medium text-[var(--nebula-text-primary)]">
                  {product.name}
                </div>

                <div className="text-xs text-[var(--nebula-text-muted)]">
                  SKU: {product.sku}
                </div>

                <div className="mt-1 text-xs">
                  <span className="text-[var(--nebula-text-secondary)]">
                    Stock: {product.currentStock}
                  </span>
                </div>
              </div>

              <div className="text-right text-sm font-semibold text-[var(--nebula-text-primary)]">
                {formatCurrency(product.sellingPrice)}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
