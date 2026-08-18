import { useNavigate } from "react-router-dom";

import {
  ShoppingCart,
  Receipt,
  Banknote,
  Boxes,
  Wallet,
  Landmark,
  type LucideIcon,
} from "lucide-react";

import type { ActivityItem, ActivityType } from "../types/activity.types";

/** Presentation metadata per activity type — icon and accent tone. */
const ACTIVITY_META: Record<
  ActivityType,
  { icon: LucideIcon; tone: string; label: string }
> = {
  sale: {
    icon: ShoppingCart,
    tone: "bg-[var(--nebula-success)]/10 text-[var(--nebula-success)]",
    label: "Sale",
  },
  purchase: {
    icon: Receipt,
    tone: "bg-[var(--nebula-warning)]/10 text-[var(--nebula-warning)]",
    label: "Purchase",
  },
  payment: {
    icon: Banknote,
    tone: "bg-[var(--nebula-info)]/10 text-[var(--nebula-info)]",
    label: "Payment",
  },
  inventory: {
    icon: Boxes,
    tone: "bg-[var(--nebula-surface-muted)] text-[var(--nebula-primary)]",
    label: "Inventory",
  },
  expense: {
    icon: Wallet,
    tone: "bg-[var(--nebula-danger)]/10 text-[var(--nebula-danger)]",
    label: "Expense",
  },
  accounting: {
    icon: Landmark,
    tone: "bg-[var(--nebula-secondary)]/10 text-[var(--nebula-secondary)]",
    label: "Accounting",
  },
};

/** Format an ISO timestamp as a short, human-friendly date + time. */
function formatDate(iso: string): string {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return iso;
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function TimelineRow({ item }: { item: ActivityItem }) {
  const navigate = useNavigate();
  const meta = ACTIVITY_META[item.type] ?? ACTIVITY_META.accounting;
  const Icon = meta.icon;

  const handleOpen = () => {
    if (item.url) {
      navigate(item.url);
    }
  };

  return (
    <li className="flex gap-3">
      <span
        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${meta.tone}`}
      >
        <Icon size={16} strokeWidth={2} aria-hidden />
      </span>

      <div className="min-w-0 flex-1">
        {/* Time-first per spec: timestamp leads the row. */}
        <time className="block text-xs text-[var(--nebula-text-muted)]">
          {formatDate(item.date)}
        </time>

        <button
          type="button"
          onClick={handleOpen}
          disabled={!item.url}
          className={`mt-0.5 block w-full text-left ${item.url ? "cursor-pointer" : "cursor-default"}`}
        >
          <p className="truncate text-sm font-medium text-[var(--nebula-text-primary)]">
            {item.title}
          </p>

          <p className="truncate text-xs text-[var(--nebula-text-secondary)]">
            {item.description}
          </p>
        </button>
      </div>
    </li>
  );
}

type ActivityTimelineProps = {
  items?: ActivityItem[];
  isLoading?: boolean;
  /** Maximum number of items to render. */
  limit?: number;
};

/** Vertical, time-first activity timeline for the Activity Center. */
export default function ActivityTimeline({
  items,
  isLoading,
  limit,
}: ActivityTimelineProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-12 animate-pulse rounded-[var(--nebula-radius-md)] border border-[var(--nebula-border)] bg-[var(--nebula-surface)]"
          />
        ))}
      </div>
    );
  }

  const list = (items ?? []).slice(0, limit);

  if (list.length === 0) {
    return (
      <p className="text-sm text-[var(--nebula-text-secondary)]">
        No recent activity to show.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {list.map((item) => (
        <TimelineRow key={item.id} item={item} />
      ))}
    </ul>
  );
}
