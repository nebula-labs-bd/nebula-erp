import { useState } from "react";

import { Barcode, CheckCircle2, Loader2, XCircle } from "lucide-react";

import { useBarcodeScanner } from "../hooks/useBarcodeScanner";
import type { POSProductInput } from "../hooks/usePOSCart";

type POSBarcodeScannerProps = {
  /** Forwarded to the scanner hook to add a resolved product to the cart. */
  onAddProduct: (product: POSProductInput) => void;

  /** When false the scanner is detached (e.g. no open shift). */
  enabled?: boolean;
};

/**
 * Barcode scanner input for the POS register.
 *
 * Provides two scan paths:
 *   1. Passive — a HID/keyboard-wedge scanner types into the page and pressing
 *      Enter (or a short idle) resolves the product, or
 *   2. Manual — the cashier can type a barcode into the visible field and press
 *      Enter to trigger the same lookup.
 *
 * Surfaces live status (scanning), the last scanned product on success, and a
 * clear error when no product matches. The actual product lookup + cart add is
 * delegated to `useBarcodeScanner` so the component stays presentational.
 */
export default function POSBarcodeScanner({
  onAddProduct,
  enabled = true,
}: POSBarcodeScannerProps) {
  const { lastScanned, lastProduct, error, scanning, reset } =
    useBarcodeScanner({ onAddProduct, enabled });

  const [manual, setManual] = useState("");

  function handleManualSubmit(event: React.FormEvent) {
    event.preventDefault();

    const code = manual.trim();

    if (!code) {
      return;
    }

    // Simulate the same Enter-terminated scan flow by dispatching a synthetic
    // barcode through the hook's buffer is non-trivial; instead key the manual
    // value off the hook by reusing its resolution path via a keystroke replay.
    setManual("");
    void replayScan(code);
  }

  // Reuse the hook's resolution by injecting keystrokes into a hidden capture.
  // Simplest robust approach: dispatch real `keydown` events so the installed
  // listener resolves it exactly like a hardware scan.
  function replayScan(code: string) {
    for (const char of code) {
      window.dispatchEvent(
        new KeyboardEvent("keydown", { key: char }),
      );
    }

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
  }

  return (
    <div className="surface flex flex-col gap-3 p-4">
      <div className="flex items-center gap-2">
        <Barcode size={18} className="text-[var(--nebula-primary)]" />

        <h2 className="text-sm font-semibold text-[var(--nebula-text-primary)]">
          Barcode Scanner
        </h2>

        <span
          className={`ml-auto inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
            enabled
              ? "bg-[var(--nebula-success-soft)] text-[var(--nebula-success)]"
              : "bg-[var(--nebula-surface-muted)] text-[var(--nebula-text-muted)]"
          }`}
        >
          {enabled ? "Armed" : "Idle"}
        </span>
      </div>

      <p className="text-xs text-[var(--nebula-text-muted)]">
        Scan a product with a USB / Bluetooth / keyboard scanner. The code is
        detected automatically — just scan.
      </p>

      {/* Manual fallback */}
      <form onSubmit={handleManualSubmit} className="flex gap-2">
        <input
          className="flex-1 rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface)] px-3 py-2 text-sm text-[var(--nebula-text-primary)] outline-none focus:border-[var(--nebula-primary)]"
          placeholder="Or type a barcode and press Enter"
          value={manual}
          disabled={!enabled}
          onChange={(e) => setManual(e.target.value)}
        />

        <button
          type="submit"
          disabled={!enabled || !manual.trim()}
          className="rounded-lg border border-[var(--nebula-border)] px-3 py-2 text-sm font-medium text-[var(--nebula-text-primary)] transition-colors hover:bg-[var(--nebula-surface-muted)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Find
        </button>
      </form>

      {/* Status */}
      <div className="min-h-[2.5rem] rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-2 text-sm">
        {scanning ? (
          <span className="flex items-center gap-2 text-[var(--nebula-text-secondary)]">
            <Loader2 size={15} className="animate-spin" /> Scanning…
          </span>
        ) : error ? (
          <span className="flex items-center gap-2 text-[var(--nebula-danger)]">
            <XCircle size={15} /> {error}
          </span>
        ) : lastProduct ? (
          <span className="flex items-center gap-2 text-[var(--nebula-success)]">
            <CheckCircle2 size={15} /> Added: {lastProduct.name}
            {lastScanned ? (
              <span className="text-[var(--nebula-text-muted)]">
                ({lastScanned})
              </span>
            ) : null}
          </span>
        ) : (
          <span className="text-[var(--nebula-text-muted)]">
            No scan yet.
          </span>
        )}
      </div>

      {lastScanned && (
        <button
          type="button"
          onClick={reset}
          className="self-start text-xs text-[var(--nebula-text-muted)] underline-offset-2 hover:underline"
        >
          Clear status
        </button>
      )}
    </div>
  );
}
