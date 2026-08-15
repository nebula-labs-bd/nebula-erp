import { apiClient } from "../../../api/client";
import { endpoints } from "../../../api/endpoints";

import {
  createStockMovement,
} from "../../inventory/services/inventory.service";

import type {
  CreateCustomerInput,
  CreateDeliveryInput,
  CreateSalesOrderInput,
  Customer,
  Delivery,
  SalesOrder,
  UpdateCustomerInput,
} from "../types/sales.types";

import type {
  CreateStockMovementInput,
  StockMovement,
} from "../../inventory/types/inventory.types";


/* ---------------------------------------------------------------- */
/* Customers                                                         */
/* ---------------------------------------------------------------- */

export function getCustomers() {
  return apiClient.get<Customer[]>(
    "/sales/customers",
  );
}


export function createCustomer(
  data: CreateCustomerInput,
) {
  return apiClient.post<Customer>(
    "/sales/customers",
    data,
  );
}


export function updateCustomer(
  data: UpdateCustomerInput,
) {
  return apiClient.post<Customer>(
    `/sales/customers/${data.id}`,
    data,
  );
}


export function deleteCustomer(
  id: string,
) {
  return apiClient.post(
    `/sales/customers/${id}/delete`,
    {},
  );
}


/* ---------------------------------------------------------------- */
/* Sales Order                                                      */
/* ---------------------------------------------------------------- */

export function getSalesOrders() {
  return apiClient.get<SalesOrder[]>(
    endpoints.sales.orders,
  );
}


export function createSalesOrder(
  data: CreateSalesOrderInput,
) {
  return apiClient.post<SalesOrder>(
    endpoints.sales.orders,
    data,
  );
}


export function updateSalesOrder(
  data: SalesOrder,
) {
  return apiClient.post<SalesOrder>(
    `/sales/orders/${data.id}`,
    data,
  );
}


/* ---------------------------------------------------------------- */
/* Delivery                                                         */
/* ---------------------------------------------------------------- */

export function getDeliveries() {
  return apiClient.post<Delivery[]>(
    "/sales/deliveries",
    {},
  );
}


export function createDelivery(
  data: CreateDeliveryInput,
) {
  return apiClient.post<Delivery>(
    "/sales/deliveries",
    data,
  );
}


/**
 * Delivery → Stock Movement (stock-out) flow.
 *
 * Inventory is NEVER updated directly. The only valid sales inventory path
 * is:
 *
 *   Sales Order → Delivery → Stock Movement (stock-out) → Stock Ledger →
 *   Inventory
 *
 * For every delivered item we create a `stock-out` movement that references
 * this delivery. The downstream Stock Ledger / Inventory update is owned by
 * the inventory engine, not by the sales module.
 */
export function createDeliveryWithStockMovements(
  delivery: Delivery,
) {
  const movements: CreateStockMovementInput[] =
    delivery.items.map((item) => ({
      productId: item.productId,

      warehouseId: delivery.warehouseId,

      type: "stock-out",

      quantity: item.deliveredQuantity,

      unitId: item.unitId,

      baseQuantity: item.baseQuantity,

      referenceType: "sale",

      referenceId: delivery.id,

      transactionDate: delivery.date,

      note:
        `Delivery for SO ${delivery.salesOrderId}`,
    }));


  const created: StockMovement[] = [];

  return movements
    .reduce(
      (chain, movement) =>
        chain.then(async (acc) => {
          const response =
            await createStockMovement(movement);

          acc.push(response.data);

          return acc;
        }),
      Promise.resolve(created),
    )
    .then((acc) => acc);
}