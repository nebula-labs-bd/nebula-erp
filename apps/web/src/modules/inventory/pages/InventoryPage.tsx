import InventoryStats from "../components/InventoryStats";
import ProductTable from "../components/ProductTable";
import ProductForm from "../components/ProductForm";

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
];


export default function InventoryPage() {
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold">
          Inventory Management
        </h1>

        <p className="mt-2 text-[var(--nebula-text-secondary)]">
          Manage products and stock.
        </p>
      </div>


      <InventoryStats
        totalProducts={1}
        totalStock={15}
        lowStock={0}
        value={950}
      />


      <ProductForm />


      <ProductTable
        products={demoProducts}
      />

    </div>
  );
}