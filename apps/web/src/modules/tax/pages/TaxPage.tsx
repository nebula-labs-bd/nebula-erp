import { useState } from "react";

import TaxForm from "../components/TaxForm";
import TaxTable from "../components/TaxTable";
import TaxSummaryCard from "../components/TaxSummaryCard";

import {
  useTaxSummary,
  useTaxTypes,
} from "../hooks/useTaxes";

import type { TaxType } from "../types/tax.types";

export default function TaxPage() {
  const { data: taxes = [] } = useTaxTypes();
  const { data: summary } = useTaxSummary();

  const [selected, setSelected] = useState<TaxType | undefined>(undefined);

  const safeSummary = summary ?? {
    totalInputTax: 0,
    totalOutputTax: 0,
    taxPayable: 0,
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold">Tax Management</h1>

        <p className="mt-2 text-[var(--nebula-text-secondary)]">
          Define tax rules (VAT, Sales Tax, Service Tax, etc.) and track tax
          applied across sales, purchases, expenses and assets. Tax affects
          accounting only and never mutates inventory, stock or products.
        </p>
      </div>

      {/* Tax Types */}
      <section id="tax-types" className="space-y-4">
        <h2 className="text-xl font-semibold">Tax Types</h2>

        <TaxForm
          tax={selected}
          onCancel={() => setSelected(undefined)}
        />

        <TaxTable taxes={taxes} />
      </section>

      {/* Tax Summary */}
      <section id="tax-summary" className="space-y-4">
        <h2 className="text-xl font-semibold">Tax Summary</h2>

        <TaxSummaryCard summary={safeSummary} />
      </section>
    </div>
  );
}
