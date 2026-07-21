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

export interface InventorySummary {
  totalProducts: number;
  totalStock: number;
  lowStock: number;
  inventoryValue: number;
}