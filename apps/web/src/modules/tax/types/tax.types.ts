/* ---------------------------------------------------------------- */
/* Tax Management — Domain Types                                     */
/* ---------------------------------------------------------------- */

export type TaxStatus = "active" | "inactive";

/**
 * A reusable tax rule (e.g. VAT 15%, Sales Tax 10%, Service Tax).
 * Tax rates are expressed as a percentage number (e.g. 15 for 15%).
 */
export interface TaxType {
  id: string;
  name: string;
  rate: number;
  description: string;
  status: TaxStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTaxTypeInput {
  name: string;
  rate: number;
  description: string;
  status: TaxStatus;
}

export interface UpdateTaxTypeInput extends Partial<CreateTaxTypeInput> {
  id: string;
}

/* ---------------------------------------------------------------- */
/* Tax Transaction Foundation                                        */
/* ---------------------------------------------------------------- */

export type TaxReferenceType = "sale" | "purchase" | "expense" | "asset";

/**
 * Foundation record linking a tax rule to a business document.
 * Tax is tracked for accounting only — it never mutates inventory,
 * stock or products.
 */
export interface TaxTransaction {
  id: string;
  taxId: string;
  referenceType: TaxReferenceType;
  referenceId: string;
  amount: number;
  date: string;
}

/* ---------------------------------------------------------------- */
/* Tax Summary                                                       */
/* ---------------------------------------------------------------- */

export interface TaxSummary {
  totalInputTax: number;
  totalOutputTax: number;
  taxPayable: number;
}
