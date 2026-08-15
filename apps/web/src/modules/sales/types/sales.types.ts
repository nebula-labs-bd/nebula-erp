export type CustomerStatus =
  | "active"
  | "inactive";


export interface Customer {
  id: string;

  name: string;

  phone: string;

  email: string;

  address: string;

  taxNumber?: string;

  status: CustomerStatus;

  createdAt: string;

  updatedAt: string;
}


export interface CreateCustomerInput {
  name: string;

  phone: string;

  email: string;

  address: string;

  taxNumber?: string;

  status: CustomerStatus;
}


export interface UpdateCustomerInput
  extends Partial<CreateCustomerInput> {
  id: string;
}


export type SalesOrderStatus =
  | "draft"
  | "confirmed"
  | "delivered"
  | "cancelled";


export interface SalesOrderItem {
  id: string;

  productId: string;

  quantity: number;

  unitId: string;

  sellingPrice: number;

  tax: number;

  discount: number;

  total: number;
}


export interface SalesOrder {
  id: string;

  customerId: string;

  orderNumber: string;

  date: string;

  status: SalesOrderStatus;

  items: SalesOrderItem[];

  subtotal: number;

  tax: number;

  discount: number;

  total: number;

  createdAt: string;
}


/**
 * Input for creating a sales order. The backend is expected to assign
 * persistent ids/createdAt; the client supplies draft ids for the line
 * items so totals can be computed before submission.
 */
export interface CreateSalesOrderInput {
  customerId: string;

  orderNumber: string;

  date: string;

  status: SalesOrderStatus;

  items: SalesOrderItem[];

  subtotal: number;

  tax: number;

  discount: number;

  total: number;
}


export type DeliveryStatus =
  | "pending"
  | "partial"
  | "delivered";


export interface DeliveryItem {
  id: string;

  productId: string;

  productName: string;

  unitId: string;

  orderedQuantity: number;

  deliveredQuantity: number;

  /** Quantity expressed in the product's base unit. */
  baseQuantity: number;
}


export interface Delivery {
  id: string;

  salesOrderId: string;

  warehouseId: string;

  date: string;

  items: DeliveryItem[];

  status: DeliveryStatus;

  createdAt: string;
}


export interface CreateDeliveryInput {
  salesOrderId: string;

  warehouseId: string;

  date: string;

  items: DeliveryItem[];

  status: DeliveryStatus;
}