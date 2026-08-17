import { useNavigate } from "react-router-dom";

import {
  Plus,
  ShoppingCart,
  Truck,
  Receipt,
  Banknote,
  Boxes,
  type LucideIcon,
} from "lucide-react";

type QuickAction = {
  label: string;
  to: string;
  icon: LucideIcon;
};

const ACTIONS: QuickAction[] = [
  { label: "New Sale", to: "/sales", icon: ShoppingCart },
  { label: "New Purchase", to: "/purchase", icon: Truck },
  { label: "New Expense", to: "/expenses", icon: Receipt },
  { label: "New Payment", to: "/payments", icon: Banknote },
  { label: "Stock Adjustment", to: "/inventory", icon: Boxes },
];

/**
 * Quick navigation shortcuts into the business modules.
 *
 * These are links only — the dashboard never creates a transaction itself.
 * Each action routes the user to the relevant module where writes happen.
 */
export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap gap-3">
      {ACTIONS.map((action) => {
        const Icon = action.icon;

        return (
          <button
            key={action.label}
            type="button"
            onClick={() => {
              navigate(action.to);
            }}
            className="flex items-center gap-2 rounded-[var(--nebula-radius-md)] border border-[var(--nebula-border)] bg-[var(--nebula-surface)] px-4 py-2.5 text-sm font-medium text-[var(--nebula-text-primary)] shadow-[var(--nebula-shadow-sm)] transition-colors hover:bg-[var(--nebula-surface-muted)]"
          >
            <Icon
              size={16}
              strokeWidth={2}
              className="text-[var(--nebula-primary)]"
              aria-hidden
            />

            <span>{action.label}</span>

            <Plus
              size={14}
              strokeWidth={2.5}
              className="text-[var(--nebula-text-muted)]"
              aria-hidden
            />
          </button>
        );
      })}
    </div>
  );
}
