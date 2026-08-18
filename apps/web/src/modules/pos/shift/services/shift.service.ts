/**
 * POS shift service.
 *
 * Cashier-shift + cash-drawer operations for the register. This is POS
 * operational logic only — it talks to the dedicated POS shift endpoints and
 * never touches accounting or inventory. The expected-cash figure is derived
 * client-side from the cash movements recorded against a shift.
 *
 * Endpoints follow the POS module spec (`nebula-spec/modules/014-pos.md`):
 *   GET  /pos/shifts              — list shifts (history + open lookup)
 *   POST /pos/shifts/open         — open a shift
 *   POST /pos/shifts/{id}/close   — close a shift
 *   POST /pos/shifts/{id}/cash-movements — record a cash movement
 */

import { apiClient } from "../../../../api/client";

import type {
  POSShift,
  CashMovement,
  OpenShiftInput,
  CloseShiftInput,
  AddCashMovementInput,
} from "../types/shift.types";

/** Open a new shift with the counted opening float. */
export function openShift(input: OpenShiftInput) {
  return apiClient.post<POSShift>("/pos/shifts/open", input);
}

/** Close an open shift with the physically counted closing cash. */
export function closeShift(shiftId: string, input: CloseShiftInput) {
  return apiClient.post<POSShift>(
    `/pos/shifts/${shiftId}/close`,
    input,
  );
}

/** Return the single open shift for the current user, or `null`. */
export async function getCurrentShift(): Promise<POSShift | null> {
  const response = await apiClient.get<POSShift[]>("/pos/shifts");

  const open = response.data.find(
    (shift) => shift.status === "open",
  );

  return open ?? null;
}

/** Return the full shift history, most recent first. */
export async function getShiftHistory(): Promise<POSShift[]> {
  const response = await apiClient.get<POSShift[]>("/pos/shifts");

  return [...response.data].sort((a, b) =>
    (b.openedAt ?? "").localeCompare(a.openedAt ?? ""),
  );
}

/**
 * Record a cash movement (sale / refund / expense / cash-in / cash-out) against
 * an open shift. This is the register's own reconciliation ledger — it does not
 * post to accounting or inventory.
 */
export function addCashMovement(
  shiftId: string,
  input: AddCashMovementInput,
) {
  return apiClient.post<CashMovement>(
    `/pos/shifts/${shiftId}/cash-movements`,
    input,
  );
}

/** List the cash movements recorded against a shift. */
export function getCashMovements(shiftId: string) {
  return apiClient.get<CashMovement[]>(
    `/pos/shifts/${shiftId}/cash-movements`,
  );
}
