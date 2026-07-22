import InventoryStats from "../components/InventoryStats";
import ProductTable from "../components/ProductTable";
import ProductForm from "../components/ProductForm";
import StockMovementForm from "../components/StockMovementForm";
import StockMovementTable from "../components/StockMovementTable";
import WarehouseForm from "../components/WarehouseForm";
import WarehouseTable from "../components/WarehouseTable";
import InventoryFilters from "../components/InventoryFilters";
import StockLedgerTable from "../components/StockLedgerTable";

import type {
  StockLedgerEntry,
  StockMovement,
  Warehouse,
} from "../types/inventory.types";

import type {
  ProductMaster,
} from "../types/product.types";



const products: ProductMaster[] = [
  {
    id: "1",

    name: "Laptop",

    sku: "LAP-001",

    barcode: "123456789",

    type: "single",


    categoryId: "electronics",

    brandId: "generic",

    unitId: "piece",


    shortDescription:
      "Business laptop",

    longDescription:
      "High performance laptop for office and professional use.",


    tags: [
      "electronics",
      "laptop",
    ],


    images: [],

    attributes: [],

    variants: [],


    costPrice: 800,

    sellingPrice: 950,

    wholesalePrice: 900,


    taxRate: 0,


    openingStock: 15,

    currentStock: 15,

    reorderLevel: 5,


    warehouseIds: [
      "1",
    ],


    batchTracking: false,

    serialTracking: true,


    warranty: {
      enabled: true,
      duration: 2,
      unit: "years",
    },


    integration: {
      syncStatus: "not-synced",
    },


    createdAt:
      "2026-07-22",

    updatedAt:
      "2026-07-22",
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



const warehouses: Warehouse[] = [
  {
    id: "1",

    name: "Main Warehouse",

    code: "WH-001",

    location: "Dhaka",

    status: "active",
  },
];



const ledger: StockLedgerEntry[] = [
  {
    id: "1",

    productName: "Laptop",

    warehouse:
      "Main Warehouse",

    type: "stock-in",

    quantity: 10,

    balance: 25,

    createdAt:
      "2026-07-22",
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
          Manage products, stock movements, warehouses and inventory records.
        </p>

      </div>



      <InventoryStats

        totalProducts={
          products.length
        }

        totalStock={
          products.reduce(
            (sum, product) =>
              sum + product.currentStock,
            0,
          )
        }

        lowStock={0}

        value={
          products.reduce(
            (sum, product) =>
              sum +
              (
                product.currentStock *
                product.sellingPrice
              ),
            0,
          )
        }

      />



      <ProductForm />



      <ProductTable

        products={
          products
        }

      />



      <StockMovementForm />



      <StockMovementTable

        movements={
          movements
        }

      />



      <WarehouseForm />



      <WarehouseTable

        warehouses={
          warehouses
        }

      />



      <InventoryFilters />



      <StockLedgerTable

        entries={
          ledger
        }

      />


    </div>

  );
}