import type {
  Asset,
  DepreciationEntry,
} from "../types/asset.types";

/* ---------------------------------------------------------------- */
/* Straight-Line Depreciation Engine                                */
/* ---------------------------------------------------------------- */

export interface StraightLineInput {
  purchaseValue: number;
  salvageValue: number;
  usefulLife: number;
}

export interface StraightLineResult {
  /** Depreciable base: max(0, purchaseValue - salvageValue). */
  depreciableBase: number;
  /** Annual depreciation expense. */
  annual: number;
  /** Monthly depreciation expense. */
  monthly: number;
}

/**
 * Straight-line depreciation:
 *
 *   (purchaseValue - salvageValue) / usefulLife
 *
 * The result is expressed per year. Returns 0 when usefulLife is not
 * positive so callers never divide by zero.
 */
export function calculateStraightLineDepreciation(
  input: StraightLineInput,
): number {
  if (!input.usefulLife || input.usefulLife <= 0) {
    return 0;
  }

  const depreciableBase = Math.max(
    0,
    input.purchaseValue - input.salvageValue,
  );

  return depreciableBase / input.usefulLife;
}

/**
 * Compute the full straight-line schedule for a single asset. Always
 * returns a positive (or zero) monthly figure.
 */
export function calculateAssetDepreciation(
  asset: Asset,
): StraightLineResult {
  const depreciableBase = Math.max(
    0,
    asset.purchaseValue - asset.salvageValue,
  );

  const annual = calculateStraightLineDepreciation({
    purchaseValue: asset.purchaseValue,
    salvageValue: asset.salvageValue,
    usefulLife: asset.usefulLife,
  });

  const monthly = annual / 12;

  return {
    depreciableBase,
    annual,
    monthly,
  };
}

/**
 * Build an immutable depreciation entry record. The `status` defaults to
 * "posted" because the accompanying journal entry has already been created.
 */
export function buildDepreciationEntry(
  asset: Asset,
  date: string,
  amount: number,
  status: DepreciationEntry["status"] = "posted",
): DepreciationEntry {
  return {
    id: `dep_${asset.id}_${Date.now()}`,
    assetId: asset.id,
    date,
    amount,
    status,
  };
}
