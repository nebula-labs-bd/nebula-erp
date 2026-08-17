export type AssetStatus = "active" | "disposed" | "retired";

export type DepreciationMethod = "straight_line";

export type AssetCategoryStatus = "active" | "inactive";

/**
 * How the asset purchase was settled. Drives the credit side of the
 * acquisition journal entry:
 *  - "paid"     -> Cash (asset account)
 *  - "payable"  -> Accounts Payable (liability account)
 */
export type AssetPaymentStatus = "paid" | "payable";

/* ---------------------------------------------------------------- */
/* Asset Categories                                                 */
/* ---------------------------------------------------------------- */

export interface AssetCategory {
  id: string;
  name: string;
  description: string;
  status: AssetCategoryStatus;
}

export interface CreateAssetCategoryInput {
  name: string;
  description: string;
  status: AssetCategoryStatus;
}

export interface UpdateAssetCategoryInput
  extends Partial<CreateAssetCategoryInput> {
  id: string;
}

/* ---------------------------------------------------------------- */
/* Assets                                                           */
/* ---------------------------------------------------------------- */

export interface Asset {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  purchaseDate: string;
  purchaseValue: number;
  /** Residual value at end of useful life. */
  salvageValue: number;
  /** Carrying (book) value after accumulated depreciation. */
  currentValue: number;
  /** Useful life in years. */
  usefulLife: number;
  depreciationMethod: DepreciationMethod;
  paymentStatus: AssetPaymentStatus;
  status: AssetStatus;
  contactId?: string;
  createdAt: string;
}

export interface CreateAssetInput {
  categoryId: string;
  name: string;
  description: string;
  purchaseDate: string;
  purchaseValue: number;
  salvageValue: number;
  usefulLife: number;
  depreciationMethod: DepreciationMethod;
  paymentStatus: AssetPaymentStatus;
  status: AssetStatus;
  contactId?: string;
}

export interface UpdateAssetInput extends Partial<CreateAssetInput> {
  id: string;
}

/* ---------------------------------------------------------------- */
/* Depreciation                                                     */
/* ---------------------------------------------------------------- */

export type DepreciationEntryStatus = "posted" | "draft";

export interface DepreciationEntry {
  id: string;
  assetId: string;
  date: string;
  amount: number;
  status: DepreciationEntryStatus;
}
