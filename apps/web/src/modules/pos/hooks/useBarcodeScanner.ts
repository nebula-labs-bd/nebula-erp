/**
 * useBarcodeScanner
 *
 * Captures barcode input from any HID barcode scanner — USB, Bluetooth, or
 * keyboard-wedge — and resolves it to a product added to the cart.
 *
 * How scanners behave: most "keyboard wedge" scanners type the digits rapidly
 * and finish with an `Enter`. We buffer global `keydown` characters until the
 * Enter (or a short idle timeout) arrives, then treat the buffer as a barcode.
 *
 * Design notes:
 *   - Input is ignored while the user is focused in a real form field (e.g. the
 *     product search box) so typed barcodes don't double-fire and scanning
 *     doesn't hijack normal typing.
 *   - Scan resolution debounces so a burst of characters from one scan is
 *     processed once.
 *   - The hook only *adds to the cart* — it maps the resolved `ProductMaster`
 *     onto the existing `POSProductInput` shape and reuses the caller's
 *     `onAddProduct` (the same path as clicking a product). No product records
 *     are created or duplicated.
 */

import { useCallback, useEffect, useRef, useState } from "react";

import { findProductByBarcode } from "../services/barcode.service";

import type { POSProductInput } from "./usePOSCart";
import type { ProductMaster } from "../../inventory/types/product.types";

export interface BarcodeScanState {
  /** Latest barcode the scanner attempted to resolve. */
  lastScanned: string | null;

  /** The product that was successfully resolved + added. */
  lastProduct: ProductMaster | null;

  /** Error message when a scan could not be resolved (e.g. not found). */
  error: string | null;

  /** True while a lookup is in flight. */
  scanning: boolean;
}

export interface UseBarcodeScannerOptions {
  /** Called with the resolved product to add it to the cart. */
  onAddProduct: (product: POSProductInput) => void;

  /** When false, the scanner is detached entirely (e.g. no shift open). */
  enabled?: boolean;

  /** Idle time (ms) after the last character that auto-commits a scan. Default 25. */
  debounceMs?: number;
}

/** Map an Inventory `ProductMaster` onto the POS cart input shape. */
function toProductInput(product: ProductMaster): POSProductInput {
  return {
    id: product.id,
    name: product.name,
    sku: product.sku,
    barcode: product.barcode,
    sellingPrice: product.sellingPrice,
    taxRate: product.taxRate,
  };
}

/** True when the active element is a text-entry field we should not hijack. */
function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tag = target.tagName;

  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
    return true;
  }

  return target.isContentEditable;
}

export function useBarcodeScanner({
  onAddProduct,
  enabled = true,
  debounceMs = 25,
}: UseBarcodeScannerOptions): BarcodeScanState & {
  reset: () => void;
} {
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [lastProduct, setLastProduct] = useState<ProductMaster | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  // Keep the latest callback in a ref so the key listener never goes stale.
  const onAddRef = useRef(onAddProduct);
  onAddRef.current = onAddProduct;

  const bufferRef = useRef("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  const reset = useCallback(() => {
    setLastScanned(null);
    setLastProduct(null);
    setError(null);
    setScanning(false);
    bufferRef.current = "";
  }, []);

  const processBarcode = useCallback(async (barcode: string) => {
    const code = barcode.trim();

    if (!code) {
      return;
    }

    setLastScanned(code);
    setError(null);
    setScanning(true);

    try {
      const product = await findProductByBarcode(code);

      if (product) {
        setLastProduct(product);
        onAddRef.current(toProductInput(product));
      } else {
        setLastProduct(null);
        setError(`No product found for barcode "${code}".`);
      }
    } catch {
      setLastProduct(null);
      setError("Barcode lookup failed. Please try again.");
    } finally {
      setScanning(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      bufferRef.current = "";

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      return;
    }

    function flush() {
      const code = bufferRef.current;
      bufferRef.current = "";

      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      if (code) {
        void processBarcode(code);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      // Never scan while the user is typing in a real field.
      if (isEditableTarget(event.target)) {
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        flush();

        return;
      }

      // Only accumulate printable single characters (digits / letters).
      if (event.key.length === 1) {
        bufferRef.current += event.key;

        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(flush, debounceMs);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      bufferRef.current = "";
    };
  }, [enabled, debounceMs, processBarcode]);

  return {
    lastScanned,
    lastProduct,
    error,
    scanning,
    reset,
  };
}
