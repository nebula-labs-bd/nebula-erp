/* ---------------------------------------------------------------- */
/* Payment Account Types                                            */
/* ---------------------------------------------------------------- */

export type PaymentAccountType =
  | "cash"
  | "bank"
  | "mobile_wallet"
  | "marketplace"
  | "gateway";

export type PaymentAccountStatus = "active" | "inactive";

export interface PaymentAccount {
  id: string;
  name: string;
  type: PaymentAccountType;
  provider?: string;
  accountNumber?: string;
  status: PaymentAccountStatus;
  createdAt: string;
}

export interface CreatePaymentAccountInput {
  name: string;
  type: PaymentAccountType;
  provider?: string;
  accountNumber?: string;
  status: PaymentAccountStatus;
}

export interface UpdatePaymentAccountInput extends Partial<CreatePaymentAccountInput> {
  id: string;
}

/* ---------------------------------------------------------------- */
/* Settlement Types                                                 */
/* ---------------------------------------------------------------- */

export type SettlementStatus = "pending" | "completed" | "cancelled";

export interface Settlement {
  id: string;
  paymentAccountId: string;
  amount: number;
  settlementDate: string;
  bankAccountId: string;
  status: SettlementStatus;
  createdAt: string;
}

export interface CreateSettlementInput {
  paymentAccountId: string;
  amount: number;
  settlementDate: string;
  bankAccountId: string;
  status: SettlementStatus;
}

export interface UpdateSettlementInput extends Partial<CreateSettlementInput> {
  id: string;
}