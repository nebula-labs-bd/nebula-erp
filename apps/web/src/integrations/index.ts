/**
 * ERP Module Integration Layer — barrel export.
 *
 * Import cross-module contracts from here:
 *
 *   import {
 *     CustomerRegistry,
 *     ProductRegistry,
 *     SalesIntegration,
 *     InventoryIntegration,
 *     ServiceIntegration,
 *     FinanceIntegration
 *   } from "integrations";
 *
 * Or use sub-path imports for tree-shaking:
 *
 *   import { getCustomer } from "integrations/customer";
 *   import { getProduct } from "integrations/product";
 *   import { getStockAvailability } from "integrations/inventory";
 */

/* Customer Registry */
export * from "./customer/customer.registry";
export * from "./customer/customer.mapper";

/* Product Registry */
export * from "./product/product.registry";
export * from "./product/product.mapper";

/* Sales Integration */
export * from "./sales/sales.integration";

/* Inventory Integration */
export * from "./inventory/inventory.integration";

/* Service Desk Integration */
export * from "./service/service.integration";

/* Finance Integration */
export * from "./finance/finance.integration";

/* Re-export core entities for convenience */
export type {
  Contact,
  CustomerContact,
  VendorContact,
  BusinessContact,
  Product,
  RecordStatus,
  DocumentStatus,
} from "core";

/* All reference types are already exported via the star-exports above. */