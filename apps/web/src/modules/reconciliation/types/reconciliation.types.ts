/* ---------------------------------------------------------------- */
/* Bank Reconciliation Types                                        */
/* ---------------------------------------------------------------- */

/* Bank transaction direction relative to the bank account.         */
export type BankTransactionType = "credit" | "debit";

/* Lifecycle of a bank transaction during reconciliation.           */
export type BankTransactionStatus =
  | "unmatched"
  | "matched"
  | "reconciled";

export interface BankTransaction {
  id: string;
  accountId: string;
  date: string;
  description: string;
  reference?: string;
  amount: number;
  type: BankTransactionType;
  status: BankTransactionStatus;
  createdAt?: string;
  updatedAt?: string;
}

/* Input used when manually importing / recording a bank statement  */
/* line. No id or status is supplied by the caller.                 */
export interface CreateBankTransactionInput {
  accountId: string;
  date: string;
  description: string;
  reference?: string;
  amount: number;
  type: BankTransactionType;
}

/* ---------------------------------------------------------------- */
/* Reconciliation Match Types                                       */
/* ---------------------------------------------------------------- */

/* Lifecycle of a proposed link between a bank transaction and a    */
/* Nebula accounting record (journal entry, payment or settlement). */
export type ReconciliationMatchStatus =
  | "matched"
  | "approved"
  | "rejected";

/* A proposed or approved reconciliation between an external bank   */
/* transaction and a Nebula accounting record.                     */
export interface ReconciliationMatch {
  id: string;
  bankTransactionId: string;
  journalEntryId: string;
  matchedAmount: number;
  status: ReconciliationMatchStatus;
  createdAt?: string;
  updatedAt?: string;
}

/* Input used to create a reconciliation proposal.                 */
export interface CreateMatchInput {
  bankTransactionId: string;
  journalEntryId: string;
  matchedAmount: number;
  status?: ReconciliationMatchStatus;
}
