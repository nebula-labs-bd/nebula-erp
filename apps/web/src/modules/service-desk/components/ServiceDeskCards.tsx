import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Inbox,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

import type { ServiceDeskDashboardStats } from "../types/service-desk.types";

type CardConfig = {
  label: string;
  value: number;
  icon: LucideIcon;
  tone: "default" | "info" | "warning" | "success";
  hint: string;
};

/**
 * Top-line service desk metrics. Mirrors the dashboard `MetricCard` visual
 * language (token-driven surfaces, semantic tones) but is tuned for the
 * service desk KPIs.
 */
export default function ServiceDeskCards({
  stats,
}: {
  stats: ServiceDeskDashboardStats;
}) {
  const cards: CardConfig[] = [
    {
      label: "Open Tickets",
      value: stats.openTickets,
      icon: Inbox,
      tone: "default",
      hint: "All non-closed requests",
    },
    {
      label: "Today's Schedule",
      value: stats.todaysSchedule,
      icon: CalendarDays,
      tone: "info",
      hint: "Visits booked for today",
    },
    {
      label: "Pending Requests",
      value: stats.pendingRequests,
      icon: AlertTriangle,
      tone: "warning",
      hint: "Awaiting triage",
    },
    {
      label: "Completed Services",
      value: stats.completedServices,
      icon: CheckCircle2,
      tone: "success",
      hint: "Closed this period",
    },
  ];

  const containerClass = (tone: CardConfig["tone"]) => {
    const base =
      "rounded-[var(--nebula-radius-lg)] border bg-[var(--nebula-surface)] p-5 shadow-[var(--nebula-shadow-sm)]";

    switch (tone) {
      case "info":
        return `${base} border-[var(--nebula-info)]/30`;
      case "warning":
        return `${base} border-[var(--nebula-warning)]/30`;
      case "success":
        return `${base} border-[var(--nebula-success)]/30`;
      default:
        return `${base} border-[var(--nebula-border)]`;
    }
  };

  const iconClass = (tone: CardConfig["tone"]) => {
    const base = "rounded-[var(--nebula-radius-md)] p-2";

    switch (tone) {
      case "info":
        return `${base} bg-[var(--nebula-info)]/10 text-[var(--nebula-info)]`;
      case "warning":
        return `${base} bg-[var(--nebula-warning)]/10 text-[var(--nebula-warning)]`;
      case "success":
        return `${base} bg-[var(--nebula-success)]/10 text-[var(--nebula-success)]`;
      default:
        return `${base} bg-[var(--nebula-surface-muted)] text-[var(--nebula-primary)]`;
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div key={card.label} className={containerClass(card.tone)}>
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-[var(--nebula-text-secondary)]">
                {card.label}
              </p>

              <span className={iconClass(card.tone)}>
                <Icon
                  size={18}
                  strokeWidth={2}
                  aria-hidden
                />
              </span>
            </div>

            <p className="mt-3 text-2xl font-bold text-[var(--nebula-text-primary)]">
              {card.value}
            </p>

            <p className="mt-1 text-xs text-[var(--nebula-text-muted)]">
              {card.hint}
            </p>
          </div>
        );
      })}
    </div>
  );
}
