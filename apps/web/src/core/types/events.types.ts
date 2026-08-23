/**
 * Shared Event Types — prepare future event system.
 *
 * These types define the contract for cross-module events.
 * Actual event emission/handling will be implemented when
 * the event bus infrastructure is ready.
 */

/** Base event envelope. */
export interface BaseEvent<T extends string, P> {
  event: T;
  timestamp: string;
  payload: P;
}

/** Customer created event. */
export interface CustomerCreatedEventPayload {
  customerId: string;
  name: string;
  customerCode?: string;
  type: "customer" | "vendor" | "business";
}
export type CustomerCreatedEvent = BaseEvent<"CUSTOMER_CREATED", CustomerCreatedEventPayload>;

/** Customer updated event. */
export interface CustomerUpdatedEventPayload {
  customerId: string;
  changes: Partial<CustomerCreatedEventPayload>;
}
export type CustomerUpdatedEvent = BaseEvent<"CUSTOMER_UPDATED", CustomerUpdatedEventPayload>;

/** Product created event. */
export interface ProductCreatedEventPayload {
  productId: string;
  name: string;
  sku?: string;
  categoryId?: string;
  brandId?: string;
}
export type ProductCreatedEvent = BaseEvent<"PRODUCT_CREATED", ProductCreatedEventPayload>;

/** Product updated event. */
export interface ProductUpdatedEventPayload {
  productId: string;
  changes: Partial<ProductCreatedEventPayload>;
}
export type ProductUpdatedEvent = BaseEvent<"PRODUCT_UPDATED", ProductUpdatedEventPayload>;

/** Sale completed event. */
export interface SaleCompletedEventPayload {
  salesOrderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  total: number;
  warehouseId: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
}
export type SaleCompletedEvent = BaseEvent<"SALE_COMPLETED", SaleCompletedEventPayload>;

/** Payment completed event. */
export interface PaymentCompletedEventPayload {
  paymentId: string;
  paymentNumber: string;
  customerId: string;
  amount: number;
  method: string;
  referenceId?: string;
  referenceType?: "sales" | "purchase" | "service" | "pos";
}
export type PaymentCompletedEvent = BaseEvent<"PAYMENT_COMPLETED", PaymentCompletedEventPayload>;

/** Service completed event. */
export interface ServiceCompletedEventPayload {
  serviceRequestId: string;
  ticketNumber: string;
  customerId: string;
  customerName: string;
  assignedEmployeeId?: string;
  partsUsed: Array<{
    productId: string;
    quantity: number;
  }>;
}
export type ServiceCompletedEvent = BaseEvent<"SERVICE_COMPLETED", ServiceCompletedEventPayload>;

/** Stock changed event. */
export interface StockChangedEventPayload {
  productId: string;
  warehouseId: string;
  change: number; // positive for in, negative for out
  newQuantity: number;
  referenceType: "sale" | "purchase" | "adjustment" | "transfer" | "service" | "pos";
  referenceId: string;
}
export type StockChangedEvent = BaseEvent<"STOCK_CHANGED", StockChangedEventPayload>;

/** Union of all event types. */
export type ERPCoreEvent =
  | CustomerCreatedEvent
  | CustomerUpdatedEvent
  | ProductCreatedEvent
  | ProductUpdatedEvent
  | SaleCompletedEvent
  | PaymentCompletedEvent
  | ServiceCompletedEvent
  | StockChangedEvent;

/** Event type discriminants for pattern matching. */
export type EventType = ERPCoreEvent["event"];

/** Type guard for event type. */
export function isEventOfType<E extends ERPCoreEvent>(
  event: ERPCoreEvent,
  type: E["event"]
): event is E {
  return event.event === type;
}