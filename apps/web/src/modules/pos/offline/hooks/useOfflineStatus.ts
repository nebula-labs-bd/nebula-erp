/**
 * POS Offline status hook.
 *
 * React hook that monitors browser connectivity and exposes the sync queue
 * status. When the browser comes back online, it automatically triggers
 * sync of any pending offline transactions.
 */

import { useCallback, useEffect, useState } from "react";

import {
  getSyncStatus,
  getQueuedTransactions,
  syncPendingTransactions,
  clearSyncedTransactions,
} from "../services/offline.service";

import type { OfflineTransaction, SyncStatus } from "../types/offline.types";

/**
 * Track online/offline status and manage the offline sync queue.
 *
 * Returns:
 * - `isOnline`: whether the browser currently has a network connection.
 * - `syncStatus`: aggregate counts of queued/syncing/synced/failed.
 * - `pendingTransactions`: list of pending/failed transactions.
 * - `syncAll()`: manually trigger sync of pending transactions.
 * - `clearSynced()`: remove successfully synced transactions from the queue.
 */
export function useOfflineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(getSyncStatus());
  const [pending, setPending] = useState<OfflineTransaction[]>(getQueuedTransactions());
  const [syncing, setSyncing] = useState(false);

  /* Listen for online/offline events. */
  useEffect(() => {
    function onOnline() {
      setIsOnline(true);
    }
    function onOffline() {
      setIsOnline(false);
    }
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  /* Refresh status whenever pending count or online status changes. */
  const refreshStatus = useCallback(() => {
    setSyncStatus(getSyncStatus());
    setPending(getQueuedTransactions());
  }, []);

  useEffect(() => {
    refreshStatus();
  }, [isOnline, refreshStatus]);

  /* Auto-sync when coming back online. */
  useEffect(() => {
    if (!isOnline || syncStatus.pending === 0 || syncing) return;

    let cancelled = false;
    (async () => {
      setSyncing(true);
      await syncPendingTransactions();
      clearSyncedTransactions();
      if (!cancelled) {
        setSyncing(false);
        refreshStatus();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isOnline, syncStatus.pending, syncing, refreshStatus]);

  /* Manual sync trigger. */
  const syncAll = useCallback(async () => {
    setSyncing(true);
    await syncPendingTransactions();
    clearSyncedTransactions();
    setSyncing(false);
    refreshStatus();
  }, [refreshStatus]);

  return {
    isOnline,
    syncStatus,
    pendingTransactions: pending,
    syncAll,
    clearSynced: () => {
      clearSyncedTransactions();
      refreshStatus();
    },
    isSyncing: syncing,
  };
}
