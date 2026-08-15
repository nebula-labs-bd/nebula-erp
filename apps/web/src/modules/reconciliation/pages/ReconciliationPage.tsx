import { useMemo } from "react";

import BankImportForm from "../components/BankImportForm";
import ReconciliationTable from "../components/ReconciliationTable";

import { useAccounts } from "../../accounting/hooks/useAccounts";
import { useJournalEntries } from "../../accounting/hooks/useJournalEntries";
import { usePayments } from "../../payments/hooks/usePayments";
import { useSettlements } from "../../payments/channels/hooks/usePaymentAccounts";

import { useBankTransactions, useMatches, useReconciliationMutations } from "../hooks/useReconciliation";

import { findPossibleMatchesForMany } from "../services/matching.service";

import type { BankTransaction } from "../types/reconciliation.types";

export default function ReconciliationPage() {
  const { data: accounts = [] } = useAccounts();
  const { data: journalEntries = [] } = useJournalEntries();
  const { data: payments = [] } = usePayments();
  const { data: settlements = [] } = useSettlements();
  const { data: bankTransactions = [] } = useBankTransactions();
  const { data: matches = [] } = useMatches();

  const {
    createReconciliationMatch,
  } = useReconciliationMutations();

  /* Candidate accounting records keyed by bank transaction id.     */
  const possibleMatches = useMemo(
    () =>
      findPossibleMatchesForMany(bankTransactions, {
        journalEntries,
        payments,
        settlements,
      }),
    [bankTransactions, journalEntries, payments, settlements],
  );

  /* Index matches by bank transaction for status display.          */
  const matchedByBank = useMemo(() => {
    const index = new Map<string, (typeof matches)[number]>();

    for (const match of matches) {
      index.set(match.bankTransactionId, match);
    }

    return index;
  }, [matches]);

  const transactionsWithStatus = useMemo(() => {
    return bankTransactions.map((transaction: BankTransaction) => {
      const match = matchedByBank.get(transaction.id);

      const status: BankTransaction["status"] =
        transaction.status === "reconciled"
          ? "reconciled"
          : match
            ? "matched"
            : "unmatched";

      return {
        ...transaction,
        status,
      };
    });
  }, [bankTransactions, matchedByBank]);

  const unmatchedTransactions = transactionsWithStatus.filter(
    (transaction) => transaction.status === "unmatched",
  );

  const matchedTransactions = transactionsWithStatus.filter(
    (transaction) => transaction.status !== "unmatched",
  );

  function handleMatch(bankTransactionId: string, journalEntryId: string) {
    const transaction = bankTransactions.find(
      (item) => item.id === bankTransactionId,
    );

    if (!transaction) return;

    createReconciliationMatch.mutate({
      bankTransactionId,
      journalEntryId,
      matchedAmount: transaction.amount,
      status: "matched",
    });
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold">Bank Reconciliation</h1>

        <p className="mt-2 text-[var(--nebula-text-secondary)]">
          Compare external financial transactions — bank statements, bKash /
          Nagad settlement files and marketplace settlements — against Nebula
          accounting records. Reconciliation affects accounting only and never
          mutates inventory, stock or products.
        </p>
      </div>

      {/* Bank Transactions — import + full list */}
      <section id="reconciliation-transactions" className="space-y-4">
        <h2 className="text-xl font-semibold">Bank Transactions</h2>

        <BankImportForm accounts={accounts} />

        <ReconciliationTable
          transactions={transactionsWithStatus}
          possibleMatches={possibleMatches}
          onMatch={handleMatch}
        />
      </section>

      {/* Unmatched Transactions */}
      <section id="reconciliation-unmatched" className="space-y-4">
        <h2 className="text-xl font-semibold">
          Unmatched Transactions ({unmatchedTransactions.length})
        </h2>

        <ReconciliationTable
          transactions={unmatchedTransactions}
          possibleMatches={possibleMatches}
          onMatch={handleMatch}
        />
      </section>

      {/* Matched Transactions */}
      <section id="reconciliation-matched" className="space-y-4">
        <h2 className="text-xl font-semibold">
          Matched Transactions ({matchedTransactions.length})
        </h2>

        <ReconciliationTable
          transactions={matchedTransactions}
          possibleMatches={possibleMatches}
        />
      </section>
    </div>
  );
}
