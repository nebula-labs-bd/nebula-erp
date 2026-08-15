import { apiClient } from "../../../api/client";

import {
  createJournalEntry,
  getAccounts,
} from "../../accounting/services/accounting.service";

import type {
  Account,
  CreateJournalEntryInput,
} from "../../accounting/types/accounting.types";

import type {
  CreatePaymentInput,
  Payment,
  UpdatePaymentInput,
} from "../types/payment.types";

/* ---------------------------------------------------------------- */
/* Payments                                                          */
/* ---------------------------------------------------------------- */

export function getPayments() {
  return apiClient.get<Payment[]>("/payments/payments");
}

export function createPayment(data: CreatePaymentInput) {
  return apiClient.post<Payment>("/payments/payments", data);
}

export function updatePayment(data: UpdatePaymentInput) {
  return apiClient.post<Payment>(`/payments/payments/${data.id}`, data);
}

export function deletePayment(id: string) {
  return apiClient.post(`/payments/payments/${id}/delete`, {});
}

/* ---------------------------------------------------------------- */
/* Accounting Integration                                            */
/*                                                                   */
/* A payment is a financial event only. It never mutates inventory,  */
/* stock or products. On creation it posts a balanced journal entry: */
/*                                                                   */
/*   Supplier payment (payable):                                     */
/*     Debit  Accounts Payable                                       */
/*     Credit Cash / Bank                                            */
/*                                                                   */
/*   Customer payment (receivable):                                  */
/*     Debit  Cash / Bank                                            */
/*     Credit Accounts Receivable                                    */
/* ---------------------------------------------------------------- */

function findAccount(
  accounts: Account[],
  match: (account: Account) => boolean,
): Account | undefined {
  return accounts.find(match);
}

export function createPaymentWithJournal(
  payment: CreatePaymentInput,
) {
  return getAccounts().then(async (response) => {
    const accounts = response.data;

    const payableAccount = findAccount(
      accounts,
      (account) =>
        account.type === "liability" &&
        /accounts payable/i.test(account.name),
    );

    const receivableAccount = findAccount(
      accounts,
      (account) =>
        account.type === "income" &&
        /accounts receivable/i.test(account.name),
    );

    const cashAccount = findAccount(
      accounts,
      (account) =>
        account.type === "asset" && /cash/i.test(account.name),
    );

    const bankAccount = findAccount(
      accounts,
      (account) =>
        account.type === "asset" && /bank/i.test(account.name),
    );

    const paidAccount =
      payment.method === "cash" ? cashAccount : bankAccount;

    const referenceAccount =
      payment.type === "payable" ? payableAccount : receivableAccount;

    const lines: CreateJournalEntryInput["lines"] = [];

    if (referenceAccount) {
      lines.push({
        accountId: referenceAccount.id,
        debit:
          payment.type === "payable" ? payment.amount : 0,
        credit:
          payment.type === "receivable" ? payment.amount : 0,
      });
    }

    if (paidAccount) {
      lines.push({
        accountId: paidAccount.id,
        debit:
          payment.type === "receivable" ? payment.amount : 0,
        credit:
          payment.type === "payable" ? payment.amount : 0,
      });
    }

    if (lines.length === 0) {
      return createPayment(payment);
    }

    const journalEntry: CreateJournalEntryInput = {
      date: payment.date,
      reference: payment.reference,
      description: `Payment (${payment.type}) - ${payment.note}`,
      lines,
    };

    await createJournalEntry(journalEntry);

    return createPayment(payment);
  });
}