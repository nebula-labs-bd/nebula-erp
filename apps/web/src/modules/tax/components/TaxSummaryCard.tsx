import type { TaxSummary } from "../types/tax.types";

type TaxSummaryCardProps = {
  summary: TaxSummary;
};

function formatAmount(value: number): string {
  return `$${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function TaxSummaryCard({ summary }: TaxSummaryCardProps) {
  const cards = [
    {
      label: "Input Tax",
      value: summary.totalInputTax,
      className: "text-blue-700",
    },
    {
      label: "Output Tax",
      value: summary.totalOutputTax,
      className: "text-purple-700",
    },
    {
      label: "Net Tax Payable",
      value: summary.taxPayable,
      className: "text-green-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <div key={card.label} className="surface p-5 space-y-2">
          <p className="text-sm text-[var(--nebula-text-secondary)]">
            {card.label}
          </p>

          <p className={`text-2xl font-bold ${card.className}`}>
            {formatAmount(card.value)}
          </p>
        </div>
      ))}
    </div>
  );
}
