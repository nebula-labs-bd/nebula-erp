export type SupplierStatus =
  | "active"
  | "inactive";


export interface Supplier {
  id: string;

  companyName: string;

  contactPerson: string;

  phone: string;

  email: string;

  address: string;

  taxNumber?: string;

  status: SupplierStatus;

  createdAt: string;

  updatedAt: string;
}


export interface CreateSupplierInput {
  companyName: string;

  contactPerson: string;

  phone: string;

  email: string;

  address: string;

  taxNumber?: string;

  status: SupplierStatus;
}


export interface UpdateSupplierInput
  extends Partial<CreateSupplierInput> {
  id: string;
}


export type PurchaseOrderStatus =
  | "draft"
  | "pending"
  | "received"
  | "cancelled";


export interface PurchaseOrderItem {
  id: string;

  productId: string;

  quantity: number;

  unitId: string;

  unitPrice: number;

  tax: number;

  discount: number;

  total: number;
}


export interface PurchaseOrder {
  id: string;

  supplierId: string;

  orderNumber: string;

  date: string;

  status: PurchaseOrderStatus;

  items: PurchaseOrderItem[];

  subtotal: number;

  tax: number;

  discount: number;

  total: number;

  createdAt: string;
}


/**
 * Input for creating a purchase order. The backend is expected to
 * assign persistent ids/createdAt; the client supplies draft ids for
 * the line items so totals can be computed before submission.
 */
export interface CreatePurchaseOrderInput {
  supplierId: string;

  orderNumber: string;

  date: string;

  status: PurchaseOrderStatus;

  items: PurchaseOrderItem[];

  subtotal: number;

  tax: number;

  discount: number;

  total: number;
}


export type GoodsReceiveStatus =
  | "pending"
  | "partial"
  | "received";


export interface GoodsReceiveItem {
  id: string;

  productId: string;

  productName: string;

  unitId: string;

  orderedQuantity: number;

  receivedQuantity: number;

  /**
   * Quantity expressed in the product's base unit.
   * Converted from `receivedQuantity` using the Unit Engine.
   */
  baseQuantity: number;
}


export interface GoodsReceive {
  id: string;

  purchaseOrderId: string;

  warehouseId: string;

  date: string;

  items: GoodsReceiveItem[];

  status: GoodsReceiveStatus;

  createdAt: string;
}


export interface CreateGoodsReceiveInput {
  purchaseOrderId: string;

  warehouseId: string;

  date: string;

  items: GoodsReceiveItem[];

  status: GoodsReceiveStatus;
}
