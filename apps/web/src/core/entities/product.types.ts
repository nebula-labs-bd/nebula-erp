/**
 * Product — the shared catalog entity.
 *
 * One product record is consumed by Inventory, POS, Sales, Purchase and
 * Service Parts. Modules reference a product by `id` and never embed a
 * duplicated copy of the catalog.
 */

import type { RecordStatus } from "../constants/status";

export interface Product {
  id: string;
  name: string;
  sku?: string;
  barcode?: string;

  /** References to shared taxonomy entities (resolved, not embedded). */
  categoryId?: string;
  brandId?: string;
  unitId?: string;

  purchasePrice?: number;
  sellingPrice?: number;
  /** Tax rate as a fraction (e.g. 0.15 for 15%) or a tax id. */
  tax?: number | string;

  status: RecordStatus;
}
