import InventoryStats from "../components/InventoryStats";
import InventoryDashboard from "../components/InventoryDashboard";
import ProductTable from "../components/ProductTable";
import ProductForm from "../components/ProductForm";
import StockMovementForm from "../components/StockMovementForm";
import StockMovementTable from "../components/StockMovementTable";
import WarehouseForm from "../components/WarehouseForm";
import WarehouseTable from "../components/WarehouseTable";
import InventoryFilters from "../components/InventoryFilters";
import StockLedgerTable from "../components/StockLedgerTable";
import UnitForm from "../components/UnitForm";
import UnitTable from "../components/UnitTable";
import UnitConversionForm from "../components/UnitConversionForm";
import UnitConversionTable from "../components/UnitConversionTable";
import StockAdjustmentForm from "../components/StockAdjustmentForm";
import StockAdjustmentTable from "../components/StockAdjustmentTable";
import StockTransferForm from "../components/StockTransferForm";
import StockTransferTable from "../components/StockTransferTable";

import type {
  StockLedgerEntry,
  StockMovement,
  Warehouse,
} from "../types/inventory.types";

import type {
  ProductMaster,
} from "../types/product.types";


import type {
  Unit,
} from "../types/unit.types";


const units: Unit[] = [

  {
    id: "1",

    name: "Meter",

    shortName: "m",

    status: "active",

    isBaseUnit: true,

    conversions: [],

    createdAt: "2026-07-23",

    updatedAt: "2026-07-23",
  },


  {
    id: "2",

    name: "Roll",

    shortName: "roll",

    status: "active",

    isBaseUnit: false,

    conversions: [

      {
        id: "1",

        fromUnitId: "2",

        toUnitId: "1",

        multiplier: 305,

      },

    ],

    createdAt: "2026-07-23",

    updatedAt: "2026-07-23",
  },

];



const unitConversions = [
  {
    id: "1",

    fromUnitId: "Roll",

    toUnitId: "Meter",

    multiplier: 305,
  },
];

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

    warehouseId: "main",

    type: "stock-in",

    quantity: 10,

    unitId: "piece",

    baseQuantity: 10,

    referenceType: "adjustment",

    referenceId: "ADJ-001",

    transactionDate: "2026-07-22",

    note: "Initial stock",

    createdAt: "2026-07-22",
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


      {/* Inventory Dashboard — view / analytics layer */}

      <InventoryDashboard />



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



      {/* Products */}

      <div
        id="inventory-products"
        className="space-y-6"
      >

        <ProductForm />



        <ProductTable

          products={
            products
          }

        />

      </div>



      {/* Warehouses */}

      <div
        id="inventory-warehouses"
        className="space-y-6"
      >

        <WarehouseForm />



        <WarehouseTable

          warehouses={
            warehouses
          }

        />

      </div>



      {/* Stock Movement */}

      <div
        id="inventory-movements"
        className="space-y-6"
      >

        <StockMovementForm />



        <StockMovementTable

          movements={
            movements
          }

        />

      </div>



      {/* Stock Adjustment */}

      <div
        id="inventory-adjustment"
        className="space-y-6"
      >

        <StockAdjustmentForm />


        <StockAdjustmentTable />

      </div>



      {/* Stock Transfer */}

      <div
        id="inventory-transfer"
        className="space-y-6"
      >

        <StockTransferForm />


        <StockTransferTable />

      </div>



      {/* Units & Conversions */}

      <UnitForm />


      <UnitTable
        units={units}
      />


      <UnitConversionForm />


      <UnitConversionTable
        conversions={unitConversions}
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
