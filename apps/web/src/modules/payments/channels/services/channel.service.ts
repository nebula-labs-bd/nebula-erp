import { apiClient } from "../../../../api/client";

import {
  createJournalEntry,
  getAccounts,
} from "../../../accounting/services/accounting.service";

import type {
  Account,
  CreateJournalEntryInput,
} from "../../../accounting/types/accounting.types";

import type {
  CreatePaymentAccountInput,
  CreateSettlementInput,
  PaymentAccount,
  Settlement,
  UpdatePaymentAccountInput,
  UpdateSettlementInput,
} from "../types/channel.types";

/* ---------------------------------------------------------------- */
/* Payment Accounts (Channels)                                      */
/* ---------------------------------------------------------------- */

export function getPaymentAccounts() {
  return apiClient.get<PaymentAccount[]>(
    "/payments/payment-accounts",
  );
}

export function createPaymentAccount(data: CreatePaymentAccountInput) {
  return apiClient.post<PaymentAccount>(
    "/payments/payment-accounts",
    data,
  );
}

export function updatePaymentAccount(data: UpdatePaymentAccountInput) {
  return apiClient.post<PaymentAccount>(
    `/payments/payment-accounts/${data.id}`,
    data,
  );
}

export function deletePaymentAccount(id: string) {
  return apiClient.post(
    `/payments/payment-accounts/${id}/delete`,
    {},
  );
}

/* ---------------------------------------------------------------- */
/* Settlements                                                      */
/* ---------------------------------------------------------------- */

export function getSettlements() {
  return apiClient.get<Settlement[]>("/payments/settlements");
}

export function createSettlement(data: CreateSettlementInput) {
  return apiClient.post<Settlement>("/payments/settlements", data);
}

export function updateSettlement(data: UpdateSettlementInput) {
  return apiClient.post<Settlement>(
    `/payments/settlements/${data.id}`,
    data,
  );
}

/* ---------------------------------------------------------------- */
/* Settlement Accounting Integration                               */
/*                                                                  */
/* A settlement moves money from a payment channel (e.g. Daraz      */
/* marketplace, bKash wallet) into a bank account. It never touches  */
/* inventory, stock or products.                                    */
/*                                                                  */
/*   Debit  Bank Account (destination)                              */
/*   Credit Payment Channel Account (source)                       */
/*                                                                  */
/* If a commission is recorded (marketplace/gateway), an additional */
/*   Debit  Commission Expense                                      */
/*   Credit Payment Channel Account                                */
/* is posted.                                                       */
/* ---------------------------------------------------------------- */

function findAccount(
  accounts: Account[],
  match: (account: Account) => boolean,
): Account | undefined {
  return accounts.find(match);
}

export function createSettlementWithJournal(
  settlement: CreateSettlementInput,
  commissionAmount = 0,
  channelName = "",
  bankName = "",
) {
  return getAccounts().then(async (response) => {
    const accounts = response.data;

    const bankAccount = findAccount(
      accounts,
      (account) =>
        account.id === settlement.bankAccountId ||
        (account.type === "asset" && /bank/i.test(account.name)),
    );

    const channelAccount = findAccount(
      accounts,
      (account) =>
        account.id === settlement.paymentAccountId ||
        (account.type === "asset" && /settlement|channel/i.test(account.name)),
    );

    const commissionAccount = findAccount(
      accounts,
      (account) =>
        account.type === "expense" && /commission/i.test(account.name),
    );

    const lines: CreateJournalEntryInput["lines"] = [];

    if (bankAccount) {
      lines.push({
        accountId: bankAccount.id,
        debit: settlement.amount,
        credit: 0,
      });
    }

    if (channelAccount) {
      lines.push({
        accountId: channelAccount.id,
        debit: 0,
        credit: settlement.amount,
      });
    }

    if (commissionAmount > 0 && commissionAccount) {
      lines.push({
        accountId: commissionAccount.id,
        debit: commissionAmount,
        credit: 0,
      });

      if (channelAccount) {
        lines.push({
          accountId: channelAccount.id,
          debit: 0,
          credit: commissionAmount,
        });
      }
    }

    if (lines.length === 0) {
      return createSettlement(settlement);
    }

    const journalEntry: CreateJournalEntryInput = {
      date: settlement.settlementDate,
      reference: `SET-${settlement.paymentAccountId}-${settlement.settlementDate}`,
      description: `Settlement: ${channelName} → ${bankName}${
        commissionAmount > 0 ? ` (commission ${commissionAmount})` : ""
      }`,
      lines,
    };

    await createJournalEntry(journalEntry);

    return createSettlement(settlement);
  });
}