import ProductTable from "../components/ProductTable";

import type { Product } from "../types/inventory.types";


const demoProducts: Product[] = [
  {
    id: "1",
    name: "Laptop",
    sku: "NB-001",
    category: "Electronics",
    quantity: 12,
    price: 950,
  },
  {
    id: "2",
    name: "Monitor",
    sku: "MN-002",
    category: "Electronics",
    quantity: 8,
    price: 220,
  },
];


export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Inventory Module
        </h1>

        <p className="mt-2 text-[var(--nebula-text-secondary)]">
          Manage products and stock.
        </p>
      </div>

      <ProductTable
        products={demoProducts}
      />
    </div>
  );
}