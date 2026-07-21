export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  price: number;
  status: "in-stock" | "low-stock" | "out-of-stock";
}

export interface InventorySummary {
  totalProducts: number;
  totalStock: number;
  lowStock: number;
  inventoryValue: number;
}