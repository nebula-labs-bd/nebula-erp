import InventoryStats from "../components/InventoryStats";
import ProductTable from "../components/ProductTable";

import type {
  Product,
} from "../types/inventory.types";


const demoProducts: Product[] = [
  {
    id: "1",
    name: "Laptop",
    sku: "LAP-001",
    category: "Electronics",
    quantity: 15,
    price: 950,
    status: "in-stock",
  },
  {
    id: "2",
    name: "Wireless Mouse",
    sku: "MOU-002",
    category: "Accessories",
    quantity: 3,
    price: 25,
    status: "low-stock",
  },
];


export default function InventoryPage() {
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold">
          Inventory Intelligence
        </h1>

        <p className="mt-2 text-[var(--nebula-text-secondary)]">
          Monitor products, stock levels and inventory value.
        </p>
      </div>


      <InventoryStats
        totalProducts={2}
        totalStock={18}
        lowStock={1}
        value={1500}
      />


      <ProductTable
        products={demoProducts}
      />

    </div>
  );
}