import { useState } from "react";

import {
  useBalanceSheet,
  useCashFlow,
  useFinancialSummary,
  useProfitLoss,
} from "../hooks/useReports";

import ReportFilter from "../components/ReportFilter";
import FinancialSummaryCards from "../components/FinancialSummaryCards";
import ProfitLossTable from "../components/ProfitLossTable";
import BalanceSheetTable from "../components/BalanceSheetTable";
import CashFlowTable from "../components/CashFlowTable";

import type { ReportPeriod } from "../types/report.types";

function defaultPeriod(): ReportPeriod {
  const end = new Date();

  const start = new Date();
  start.setMonth(start.getMonth() - 1);

  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
    type: "custom",
  };
}

function SectionHeading({ title }: { title: string }) {
  return <h2 className="text-xl font-semibold">{title}</h2>;
}

export default function ReportsPage() {
  const [period, setPeriod] = useState<ReportPeriod>(defaultPeriod());

  const summary = useFinancialSummary(period);
  const profitLoss = useProfitLoss(period);
  const balanceSheet = useBalanceSheet(period);
  const cashFlow = useCashFlow(period);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold">Financial Reports</h1>

        <p className="mt-2 text-[var(--nebula-text-secondary)]">
          Aggregate existing ERP data into business views — profit &amp; loss,
          balance sheet, cash flow and a financial overview. Read-only
          reporting that informs management decisions.
        </p>
      </div>

      {/* Filter Foundation */}
      <section className="space-y-4">
        <ReportFilter
          period={period}
          onChange={setPeriod}
          showTypeSelector
        />
      </section>

      {/* Financial Overview */}
      <section id="financial-overview" className="space-y-4">
        <SectionHeading title="Financial Overview" />

        <FinancialSummaryCards
          summary={summary.data}
          isLoading={summary.isLoading}
        />
      </section>

      {/* Profit & Loss */}
      <section id="profit-loss" className="space-y-4">
        <SectionHeading title="Profit &amp; Loss" />

        <ProfitLossTable
          report={profitLoss.data}
          isLoading={profitLoss.isLoading}
        />
      </section>

      {/* Balance Sheet */}
      <section id="balance-sheet" className="space-y-4">
        <SectionHeading title="Balance Sheet" />

        <BalanceSheetTable
          report={balanceSheet.data}
          isLoading={balanceSheet.isLoading}
        />
      </section>

      {/* Cash Flow */}
      <section id="cash-flow" className="space-y-4">
        <SectionHeading title="Cash Flow" />

        <CashFlowTable
          report={cashFlow.data}
          isLoading={cashFlow.isLoading}
        />
      </section>
    </div>
  );
}
