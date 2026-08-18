/**
 * POS barcode lookup service.
 *
 * Barcode is only an *input method* for the POS — it is never a source of
 * product truth. This service resolves a scanned barcode to the existing
 * Inventory `ProductMaster` record so the POS can add that single real product
 * to the cart. It does not create, duplicate, or mutate products.
 */

import { apiClient } from "../../../api/client";

import type { ProductMaster } from "../../inventory/types/product.types";

/**
 * Look up a single product by its barcode.
 *
 * Uses the existing inventory product API pattern (`apiClient.get`). The
 * `/products/barcode/:barcode` endpoint is expected to return the matching
 * `ProductMaster` (or 404 when not found). A 404 is normal — it means "no
 * product with that barcode", so we return `null` rather than throwing, letting
 * the scanner surface a friendly "product not found" message.
 */
export async function findProductByBarcode(
  barcode: string,
): Promise<ProductMaster | null> {
  const normalized = barcode.trim();

  if (!normalized) {
    return null;
  }

  try {
    const response = await apiClient.get<ProductMaster>(
      `/products/barcode/${encodeURIComponent(normalized)}`,
    );

    return response.data;
  } catch {
    // 404 / network error → treat as "no matching product".
    return null;
  }
}
