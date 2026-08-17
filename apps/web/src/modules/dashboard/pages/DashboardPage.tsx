import ExecutiveCards from "../components/ExecutiveCards";
import FinancialSnapshot from "../components/FinancialSnapshot";
import InventoryHealth from "../components/InventoryHealth";
import RecentActivity from "../components/RecentActivity";
import QuickActions from "../components/QuickActions";

import {
  useDashboardSummary,
  useInventorySummary,
  useRecentActivity,
} from "../hooks/useDashboard";

function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold text-[var(--nebula-text-primary)]">
        {title}
      </h2>

      {subtitle ? (
        <p className="mt-1 text-sm text-[var(--nebula-text-secondary)]">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Nebula ERP Command Center.
 *
 * A read-only aggregation surface that turns live ERP data into a
 * business overview and decision center. All data is sourced through
 * read-only React Query hooks — no transactions are created here.
 */
export default function DashboardPage() {
  const summary = useDashboardSummary();
  const inventory = useInventorySummary();
  const activity = useRecentActivity();

  return (
    <div className="space-y-10">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-[var(--nebula-text-primary)]">
          Command Center
        </h1>

        <p className="text-[var(--nebula-text-secondary)]">
          Real-time business overview aggregated from sales, purchases,
          inventory and finance. Read-only — your decision center for the day.
        </p>
      </header>

      {/* Executive Cards */}
      <section
        id="executive-cards"
        aria-label="Executive overview"
      >
        <SectionHeading
          title="Executive Overview"
          subtitle="Today's top-line performance at a glance."
        />

        <ExecutiveCards
          summary={summary.data}
          isLoading={summary.isLoading}
        />
      </section>

      {/* Financial Snapshot */}
      <section
        id="financial-snapshot"
        aria-label="Financial snapshot"
      >
        <SectionHeading
          title="Financial Snapshot"
          subtitle="Liquidity and outstanding obligations."
        />

        <FinancialSnapshot
          summary={summary.data}
          isLoading={summary.isLoading}
        />
      </section>

      {/* Inventory Health */}
      <section
        id="inventory-health"
        aria-label="Inventory health"
      >
        <SectionHeading
          title="Inventory Health"
          subtitle="Stock position and replenishment risk."
        />

        <InventoryHealth
          summary={inventory.data}
          isLoading={inventory.isLoading}
        />
      </section>

      {/* Recent Activity */}
      <section
        id="recent-activity"
        aria-label="Recent activity"
      >
        <SectionHeading
          title="Recent Activity"
          subtitle="Latest sales, payments, purchases and stock movements."
        />

        <div className="rounded-[var(--nebula-radius-lg)] border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-5 shadow-[var(--nebula-shadow-sm)]">
          <RecentActivity
            items={activity.data}
            isLoading={activity.isLoading}
          />
        </div>
      </section>

      {/* Quick Actions */}
      <section
        id="quick-actions"
        aria-label="Quick actions"
      >
        <SectionHeading
          title="Quick Actions"
          subtitle="Jump straight into a business module."
        />

        <QuickActions />
      </section>
    </div>
  );
}
