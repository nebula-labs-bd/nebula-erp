import { apiClient } from "../../../api/client";

import {
  createJournalEntry,
  getAccounts,
} from "../../accounting/services/accounting.service";

import type {
  Account,
  CreateJournalEntryInput,
} from "../../accounting/types/accounting.types";

import {
  buildDepreciationEntry,
  calculateAssetDepreciation,
} from "./depreciation.service";

import type {
  Asset,
  AssetCategory,
  CreateAssetCategoryInput,
  CreateAssetInput,
  DepreciationEntry,
  UpdateAssetCategoryInput,
  UpdateAssetInput,
} from "../types/asset.types";

/* ---------------------------------------------------------------- */
/* Asset Categories                                                 */
/* ---------------------------------------------------------------- */

export function getAssetCategories() {
  return apiClient.get<AssetCategory[]>("/assets/categories");
}

export function createAssetCategory(data: CreateAssetCategoryInput) {
  return apiClient.post<AssetCategory>("/assets/categories", data);
}

export function updateAssetCategory(data: UpdateAssetCategoryInput) {
  return apiClient.post<AssetCategory>(
    `/assets/categories/${data.id}`,
    data,
  );
}

export function deleteAssetCategory(id: string) {
  return apiClient.post(`/assets/categories/${id}/delete`, {});
}

/* ---------------------------------------------------------------- */
/* Assets                                                           */
/* ---------------------------------------------------------------- */

export function getAssets() {
  return apiClient.get<Asset[]>("/assets/assets");
}

export function createAsset(data: CreateAssetInput) {
  return apiClient.post<Asset>("/assets/assets", data);
}

export function updateAsset(data: UpdateAssetInput) {
  return apiClient.post<Asset>(`/assets/assets/${data.id}`, data);
}

export function deleteAsset(id: string) {
  return apiClient.post(`/assets/assets/${id}/delete`, {});
}


/* ---------------------------------------------------------------- */
/* Accounting Integration                                           */
/* ---------------------------------------------------------------- */

function findAccount(
  accounts: Account[],
  match: (account: Account) => boolean,
): Account | undefined {
  return accounts.find(match);
}

/**
 * Resolve the accounts required for an asset acquisition journal entry.
 *
 *  - Asset account       -> type "asset", name matches the asset
 *  - Cash account        -> type "asset", name matches "cash"
 *  - Payable account     -> type "liability", name matches "accounts payable"
 */
function resolveAssetAccounts(
  accounts: Account[],
  asset: CreateAssetInput,
) {
  const assetAccount =
    findAccount(
      accounts,
      (account) =>
        account.type === "asset" &&
        new RegExp(asset.name, "i").test(account.name),
    ) ||
    findAccount(
      accounts,
      (account) =>
        account.type === "asset" && /fixed asset|asset/i.test(account.name),
    );

  const cashAccount = findAccount(
    accounts,
    (account) => account.type === "asset" && /cash/i.test(account.name),
  );

  const payableAccount = findAccount(
    accounts,
    (account) =>
      account.type === "liability" && /accounts payable/i.test(account.name),
  );

  const creditAccount =
    asset.paymentStatus === "paid" ? cashAccount : payableAccount;

  return { assetAccount, creditAccount };
}

/**
 * Create an asset together with its acquisition journal entry.
 *
 *   Debit  : Asset Account
 *   Credit : Cash (paid) / Accounts Payable (payable)
 *
 * The journal entry is created first (capitalisation), then the asset
 * record itself is persisted. This never touches inventory or stock.
 */
export async function createAssetWithJournal(
  asset: CreateAssetInput,
): Promise<Asset> {
  const response = await getAccounts();
  const accounts = response.data;

  const { assetAccount, creditAccount } = resolveAssetAccounts(
    accounts,
    asset,
  );

  const lines: CreateJournalEntryInput["lines"] = [];

  if (assetAccount) {
    lines.push({
      accountId: assetAccount.id,
      debit: asset.purchaseValue,
      credit: 0,
    });
  }

  if (creditAccount) {
    lines.push({
      accountId: creditAccount.id,
      debit: 0,
      credit: asset.purchaseValue,
    });
  }

  if (lines.length === 2) {
    const journalEntry: CreateJournalEntryInput = {
      date: asset.purchaseDate,
      reference: `AST-${Date.now()}`,
      description: `Asset purchase: ${asset.name} - ${asset.description}`,
      lines,
    };

    await createJournalEntry(journalEntry);
  }

  const assetResponse = await createAsset(asset);

  return assetResponse.data;
}

/**
 * Post a depreciation charge for an asset, creating the depreciation
 * journal entry and a depreciation entry record.
 *
 *   Debit  : Depreciation Expense
 *   Credit : Accumulated Depreciation
 */
export async function createAssetDepreciation(
  asset: Asset,
  date: string,
): Promise<DepreciationEntry> {
  const amount = calculateAssetDepreciation(asset).annual;

  const response = await getAccounts();
  const accounts = response.data;

  const expenseAccount = findAccount(
    accounts,
    (account) =>
      account.type === "expense" &&
      /depreciation/i.test(account.name),
  );

  const accumulatedAccount = findAccount(
    accounts,
    (account) =>
      account.type === "asset" &&
      /accumulated depreciation/i.test(account.name),
  );

  const lines: CreateJournalEntryInput["lines"] = [];

  if (expenseAccount) {
    lines.push({
      accountId: expenseAccount.id,
      debit: amount,
      credit: 0,
    });
  }

  if (accumulatedAccount) {
    lines.push({
      accountId: accumulatedAccount.id,
      debit: 0,
      credit: amount,
    });
  }

  if (lines.length === 2) {
    const journalEntry: CreateJournalEntryInput = {
      date,
      reference: `DEP-${asset.id}-${Date.now()}`,
      description: `Depreciation: ${asset.name}`,
      lines,
    };

    await createJournalEntry(journalEntry);
  }

  return buildDepreciationEntry(asset, date, amount);
}
