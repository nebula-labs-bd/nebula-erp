/**
 * POS Offline domain types.
 *
 * Provides the foundation for offline-aware POS. When the network is
 * unavailable, the POS queues local transactions that sync when connectivity
 * is restored. Conflict resolution is not yet implemented — all queued
 * transactions replay in FIFO order via the existing POS sales flow.
 */

import type { Cart, POSCustomer } from "../../types/pos.types";

import type { POSPayment } from "../../types/transaction.types";

/* ---------------------------------------------------------------- */
/* Offline Transaction                                               */
/* ---------------------------------------------------------------- */

/** Status of a locally queued transaction. */
export type OfflineTxnStatus =
  | "pending"       // awaiting sync
  | "syncing"       // currently being sent to the server
  | "synced"        // successfully synced
  | "failed";       // sync failed (server error)

/** A POS sale queued locally for offline replay. */
export interface OfflineTransaction {
  /** Client-generated id (crypto.randomUUID). */
  id: string;

  /** ISO timestamp when the transaction was created offline. */
  createdAt: string;

  /** Snapshot of the cart at time of sale. */
  cart: Cart;

  /** Snapshot of the customer. */
  customer: POSCustomer | null;

  /** Snapshot of the payment tenders. */
  payments: POSPayment[];

  warehouseId: string;

  shiftId?: string;

  status: OfflineTxnStatus;

  /** Server-assigned sales order id after successful sync. */
  syncedSalesOrderId?: string;

  /** Last error message if status === "failed". */
  error?: string;
}

/* ---------------------------------------------------------------- */
/* Sync Status                                                       */
/* ---------------------------------------------------------------- */

/** Aggregate sync status of the offline queue. */
export interface SyncStatus {
  /** Total pending transactions in the queue. */
  pending: number;

  /** Currently syncing. */
  syncing: number;

  /** Successfully synced. */
  synced: number;

  /** Failed (needs retry). */
  failed: number;
}
