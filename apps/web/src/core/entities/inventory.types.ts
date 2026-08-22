/**
 * Inventory — warehouses, stock levels and stock movements.
 *
 * Stock is always expressed as a (productId, warehouseId) pair so every
 * module that ships, sells or services reads the same on-hand numbers.
 */

export type StockMovementType =
  | "IN"
  | "OUT"
  | "TRANSFER"
  | "ADJUSTMENT";

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  address?: string;
  managerId?: string;
}

export interface Stock {
  productId: string;
  warehouseId: string;
  quantity: number;
  reservedQuantity: number;
}

export interface StockMovement {
  id: string;
  type: StockMovementType;
  productId: string;
  warehouseId: string;
  quantity: number;
  referenceType?: string;
  referenceId?: string;
  createdAt: string;
}
