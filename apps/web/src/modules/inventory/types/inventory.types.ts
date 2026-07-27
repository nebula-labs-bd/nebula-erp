export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  price: number;
  status: "in-stock" | "low-stock" | "out-of-stock";
}


export interface CreateProductInput {
  name: string;
  sku: string;
  category: string;
  quantity: number;
  price: number;
}


export interface UpdateProductInput
  extends Partial<CreateProductInput> {
  id: string;
}


export type StockMovementType =
  | "stock-in"
  | "stock-out"
  | "adjustment";


export interface StockMovement {
  id: string;

  productId: string;

  productName: string;


  warehouseId: string;


  type: StockMovementType;


  quantity: number;


  unitId: string;


  baseQuantity: number;


  referenceType?: 
    | "purchase"
    | "sale"
    | "adjustment"
    | "transfer";


  referenceId?: string;


  reason?: string;


  note: string;


  createdBy?: string;


  createdAt: string;
}



export interface CreateStockMovementInput {

  productId: string;


  warehouseId: string;


  type: StockMovementType;


  quantity: number;


  unitId: string;


  baseQuantity: number;


  referenceType?:
    | "purchase"
    | "sale"
    | "adjustment"
    | "transfer";


  referenceId?: string;


  reason?: string;


  note: string;

}


export interface Warehouse {
  id: string;
  name: string;
  code: string;
  location: string;
  status: "active" | "inactive";
}


export interface CreateWarehouseInput {
  name: string;
  code: string;
  location: string;
}


export interface StockLedgerEntry {
  id: string;
  productName: string;
  warehouse: string;
  type: StockMovementType;
  quantity: number;
  balance: number;
  createdAt: string;
}


export interface InventorySummary {
  totalProducts: number;
  totalStock: number;
  lowStock: number;
  inventoryValue: number;
}