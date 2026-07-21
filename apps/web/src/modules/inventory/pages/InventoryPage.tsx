import InventoryStats from "../components/InventoryStats";
import ProductTable from "../components/ProductTable";
import ProductForm from "../components/ProductForm";
import StockMovementForm from "../components/StockMovementForm";
import StockMovementTable from "../components/StockMovementTable";
import WarehouseForm from "../components/WarehouseForm";
import WarehouseTable from "../components/WarehouseTable";

import type {
  Warehouse,
} from "../types/inventory.types";

const warehouses: Warehouse[] = [
  {
    id: "1",
    name: "Main Warehouse",
    code: "WH-001",
    location: "Dhaka",
    status: "active",
  },
];
import type {
  Product,
  StockMovement,
} from "../types/inventory.types";


const products: Product[] = [
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


const movements: StockMovement[] = [
  {
    id: "1",
    productId: "1",
    productName: "Laptop",
    type: "stock-in",
    quantity: 10,
    note: "Initial stock",
    date: "2026-07-22",
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
          Manage products and stock movements.
        </p>
      </div>


      <InventoryStats
        totalProducts={1}
        totalStock={15}
        lowStock={0}
        value={950}
      />


      <ProductForm />


      <StockMovementForm />


      <ProductTable
        products={products}
      />


      <StockMovementTable
        movements={movements}
      />


      <WarehouseForm />
      <WarehouseTable
        warehouses={warehouses}
      />
    </div>
  );
}