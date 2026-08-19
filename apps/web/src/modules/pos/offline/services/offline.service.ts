/**
 * POS Offline service.
 *
 * Local-first storage layer for offline POS transactions. Transactions are
 * persisted to localStorage (a simple IndexedDB-free approach suitable for
 * the MVP). When the network is available, the sync function replays each
 * pending transaction through the existing POS sales flow — the same path
 * as an online sale. Conflict resolution is not yet implemented.
 */

import { createPOSTransaction } from "../../services/pos.service";

import type { Cart, POSCustomer } from "../../types/pos.types";

import type { POSPayment } from "../../types/transaction.types";

import type { OfflineTransaction, SyncStatus } from "../types/offline.types";

const STORAGE_KEY = "pos_offline_transactions";

/* ---------------------------------------------------------------- */
/* Local persistence                                                 */
/* ---------------------------------------------------------------- */

function loadTransactions(): OfflineTransaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTransactions(txns: OfflineTransaction[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(txns));
}

/* ---------------------------------------------------------------- */
/* Queue a transaction                                               */
/* ---------------------------------------------------------------- */

/**
 * Store a sale in the local queue. Returns the offline transaction id.
 * The actual server-side sale is deferred until sync runs.
 */
export function queueTransaction(
  cart: Cart,
  customer: POSCustomer | null,
  payments: POSPayment[],
  warehouseId: string,
  shiftId?: string,
): string {
  const id = crypto.randomUUID();
  const txn: OfflineTransaction = {
    id,
    createdAt: new Date().toISOString(),
    cart,
    customer,
    payments,
    warehouseId,
    shiftId,
    status: "pending",
  };

  const txns = loadTransactions();
  txns.push(txn);
  saveTransactions(txns);

  return id;
}

/* ---------------------------------------------------------------- */
/* Status                                                            */
/* ---------------------------------------------------------------- */

/** Read current aggregate sync status from the local queue. */
export function getSyncStatus(): SyncStatus {
  const txns = loadTransactions();
  return {
    pending: txns.filter((t) => t.status === "pending").length,
    syncing: txns.filter((t) => t.status === "syncing").length,
    synced: txns.filter((t) => t.status === "synced").length,
    failed: txns.filter((t) => t.status === "failed").length,
  };
}

/** Read all pending/failed transactions for the UI. */
export function getQueuedTransactions(): OfflineTransaction[] {
  return loadTransactions().filter(
    (t) => t.status === "pending" || t.status === "failed",
  );
}

/* ---------------------------------------------------------------- */
/* Sync                                                              */
/* ---------------------------------------------------------------- */

/**
 * Replay all pending transactions through the existing POS sales flow.
 * FIFO order, no conflict resolution. Each successful sync marks the
 * transaction as "synced"; errors mark it "failed" for retry.
 */
export async function syncPendingTransactions(): Promise<{
  synced: number;
  failed: number;
}> {
  const txns = loadTransactions();
  let synced = 0;
  let failed = 0;

  for (const txn of txns) {
    if (txn.status !== "pending" && txn.status !== "failed") continue;

    txn.status = "syncing";
    saveTransactions(txns);

    try {
      const result = await createPOSTransaction(
        txn.cart,
        txn.customer,
        txn.payments,
        txn.warehouseId,
        txn.shiftId,
      );
      txn.status = "synced";
      txn.syncedSalesOrderId = result.salesOrder?.id ?? "";
      synced++;
    } catch (err) {
      txn.status = "failed";
      txn.error =
        err instanceof Error ? err.message : "Unknown sync error";
      failed++;
    }

    saveTransactions(txns);
  }

  return { synced, failed };
}

/* ---------------------------------------------------------------- */
/* Cleanup                                                           */
/* ---------------------------------------------------------------- */

/** Remove all synced (successfully completed) transactions from the queue. */
export function clearSyncedTransactions(): void {
  const txns = loadTransactions();
  saveTransactions(txns.filter((t) => t.status !== "synced"));
}
