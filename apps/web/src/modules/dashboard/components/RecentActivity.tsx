import {
  ShoppingCart,
  Banknote,
  Truck,
  Boxes,
  type LucideIcon,
} from "lucide-react";

import { formatActivityDate } from "../utils/format";

import type {
  ActivityItem,
  ActivityType,
} from "../types/dashboard.types";

type RecentActivityProps = {
  items?: ActivityItem[];
  isLoading?: boolean;
};

const ACTIVITY_META: Record<
  ActivityType,
  { icon: LucideIcon; tone: string; label: string }
> = {
  sale: {
    icon: ShoppingCart,
    tone: "bg-[var(--nebula-success)]/10 text-[var(--nebula-success)]",
    label: "Sale",
  },
  payment: {
    icon: Banknote,
    tone: "bg-[var(--nebula-info)]/10 text-[var(--nebula-info)]",
    label: "Payment",
  },
  purchase: {
    icon: Truck,
    tone: "bg-[var(--nebula-warning)]/10 text-[var(--nebula-warning)]",
    label: "Purchase",
  },
  "stock-movement": {
    icon: Boxes,
    tone: "bg-[var(--nebula-surface-muted)] text-[var(--nebula-primary)]",
    label: "Stock",
  },
};

function Skeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="h-12 animate-pulse rounded-[var(--nebula-radius-md)] border border-[var(--nebula-border)] bg-[var(--nebula-surface)]"
        />
      ))}
    </div>
  );
}

function TimelineRow({ item }: { item: ActivityItem }) {
  const meta = ACTIVITY_META[item.type] ?? ACTIVITY_META["stock-movement"];
  const Icon = meta.icon;

  return (
    <li className="flex gap-3">
      <span
        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${meta.tone}`}
      >
        <Icon
          size={16}
          strokeWidth={2}
          aria-hidden
        />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="truncate text-sm font-medium text-[var(--nebula-text-primary)]">
            {item.title}
          </p>

          <time className="shrink-0 text-xs text-[var(--nebula-text-muted)]">
            {formatActivityDate(item.date)}
          </time>
        </div>

        <p className="truncate text-xs text-[var(--nebula-text-secondary)]">
          {item.description}
        </p>
      </div>
    </li>
  );
}

/** Recent business events rendered as a timeline. */
export default function RecentActivity({
  items,
  isLoading,
}: RecentActivityProps) {
  if (isLoading) {
    return <Skeleton />;
  }

  if (!items || items.length === 0) {
    return (
      <p className="text-[var(--nebula-text-secondary)]">
        No recent activity to show.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <TimelineRow
          key={item.id}
          item={item}
        />
      ))}
    </ul>
  );
}
