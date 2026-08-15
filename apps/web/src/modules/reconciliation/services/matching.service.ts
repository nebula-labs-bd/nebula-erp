/* ---------------------------------------------------------------- */
/* Matching Engine                                                  */
/* ---------------------------------------------------------------- */

/* The matching engine compares external bank transactions against  */
/* Nebula accounting records (journal entries, payments and         */
/* settlements). It supports bank statement lines, bKash / Nagad    */
/* mobile-wallet settlement files and marketplace settlement feeds. */
/*                                                                  */
/* Matching is accounting-only: it never reads or mutates           */
/* inventory, stock or products.                                    */

import type {
  BankTransaction,
} from "../types/reconciliation.types";

import type {
  JournalEntry,
} from "../../accounting/types/accounting.types";

import type {
  Payment,
} from "../../payments/types/payment.types";

import type {
  Settlement,
} from "../../payments/channels/types/channel.types";

/* A candidate accounting record that may reconcile a bank line.    */
export type MatchSourceType =
  | "journal_entry"
  | "payment"
  | "settlement";

export interface PossibleMatch {
  sourceType: MatchSourceType;
  sourceId: string;
  reference: string;
  description: string;
  date: string;
  amount: number;
  /* 0..1 similarity score against the bank transaction.            */
  score: number;
}

/* Normalize a reference for loose comparison.                      */
function normalizeReference(value?: string): string {
  if (!value) return "";

  return value
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

/* Similarity between two references (0 = no match, 1 = identical). */
function referenceSimilarity(
  a?: string,
  b?: string,
): number {
  const na = normalizeReference(a);
  const nb = normalizeReference(b);

  if (!na || !nb) return 0;

  if (na === nb) return 1;

  return na.includes(nb) || nb.includes(na) ? 0.5 : 0;
}

/* Convert a bank transaction amount into a positive absolute value */
/* for comparison with accounting record magnitudes.               */
function absoluteAmount(amount: number): number {
  return Math.abs(amount);
}

/* Compare two monetary amounts allowing for floating point drift.  */
function amountsEqual(a: number, b: number): boolean {
  return Math.abs(a - b) < 0.01;
}

/* Build candidate accounting records from the available sources.   */
function toCandidates(
  journalEntries: JournalEntry[],
  payments: Payment[],
  settlements: Settlement[],
): PossibleMatch[] {
  const candidates: PossibleMatch[] = [];

  for (const entry of journalEntries) {
    const amount = entry.lines.reduce(
      (sum, line) => sum + line.debit + line.credit,
      0,
    );

    if (amount <= 0) continue;

    candidates.push({
      sourceType: "journal_entry",
      sourceId: entry.id,
      reference: entry.reference,
      description: entry.description,
      date: entry.date,
      amount,
      score: 0,
    });
  }

  for (const payment of payments) {
    candidates.push({
      sourceType: "payment",
      sourceId: payment.id,
      reference: payment.reference,
      description: payment.note || payment.status,
      date: payment.date,
      amount: absoluteAmount(payment.amount),
      score: 0,
    });
  }

  for (const settlement of settlements) {
    candidates.push({
      sourceType: "settlement",
      sourceId: settlement.id,
      reference: settlement.id,
      description: `Settlement ${settlement.status}`,
      date: settlement.settlementDate,
      amount: absoluteAmount(settlement.amount),
      score: 0,
    });
  }

  return candidates;
}

/* Find possible Nebula accounting records for a single bank line.  */
export function findPossibleMatches(
  bankTransaction: BankTransaction,
  sources: {
    journalEntries?: JournalEntry[];
    payments?: Payment[];
    settlements?: Settlement[];
  },
): PossibleMatch[] {
  const candidates = toCandidates(
    sources.journalEntries ?? [],
    sources.payments ?? [],
    sources.settlements ?? [],
  );

  const bankAmount = absoluteAmount(bankTransaction.amount);
  const scored: PossibleMatch[] = [];

  for (const candidate of candidates) {
    const amountMatches = amountsEqual(
      candidate.amount,
      bankAmount,
    );

    const similarity = referenceSimilarity(
      bankTransaction.reference,
      candidate.reference,
    );

    /* A match requires equal amounts; reference similarity boosts   */
    /* the score so the strongest candidate surfaces first.          */
    if (!amountMatches) continue;

    scored.push({
      ...candidate,
      score: 0.5 + similarity * 0.5,
    });
  }

  return scored.sort((a, b) => b.score - a.score);
}

/* Find possible matches for a list of bank transactions.           */
export function findPossibleMatchesForMany(
  bankTransactions: BankTransaction[],
  sources: {
    journalEntries?: JournalEntry[];
    payments?: Payment[];
    settlements?: Settlement[];
  },
): Record<string, PossibleMatch[]> {
  const result: Record<string, PossibleMatch[]> = {};

  for (const bankTransaction of bankTransactions) {
    result[bankTransaction.id] = findPossibleMatches(
      bankTransaction,
      sources,
    );
  }

  return result;
}
