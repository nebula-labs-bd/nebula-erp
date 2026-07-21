export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  price: number;
}

export interface InventorySummary {
  totalProducts: number;
  lowStock: number;
  totalValue: number;
}