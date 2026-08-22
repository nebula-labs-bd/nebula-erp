import type { LucideIcon } from "lucide-react";

/**
 * Lightweight placeholder for the not-yet-built Service Desk surfaces
 * (Customers, Businesses, Technicians, Schedule, Reports). The foundation
 * ships the data model, hooks and the Dashboard/Requests flows; these pages
 * establish the route and nav entry so the IA is complete.
 */
export default function ServiceDeskPlaceholderPage({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="rounded-[var(--nebula-radius-md)] bg-[var(--nebula-surface-muted)] p-2 text-[var(--nebula-primary)]">
            <Icon
              size={20}
              strokeWidth={2}
              aria-hidden
            />
          </span>

          <h1 className="text-2xl font-bold text-[var(--nebula-text-primary)]">
            {title}
          </h1>
        </div>

        <p className="text-[var(--nebula-text-secondary)]">{description}</p>
      </header>

      <div className="rounded-[var(--nebula-radius-lg)] border border-dashed border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-10 text-center text-sm text-[var(--nebula-text-muted)]">
        This surface is part of the Service Desk foundation. The data model,
        service hooks and the Dashboard/Requests flows are in place — this view
        will be built out next.
      </div>
    </div>
  );
}
