import GlobalSearch from "../../modules/search/components/GlobalSearch";
import NotificationBell from "../../modules/notifications/components/NotificationBell";

export default function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-[var(--nebula-border)] bg-[var(--nebula-surface)] px-6">
      <h2 className="text-lg font-semibold text-[var(--nebula-text-primary)]">
        Dashboard
      </h2>

      <div className="flex items-center gap-3">
        <GlobalSearch />

        <NotificationBell />

        <div className="text-sm text-[var(--nebula-text-secondary)]">
          Admin User
        </div>
      </div>
    </header>
  );
}
