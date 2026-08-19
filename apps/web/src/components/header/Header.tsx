import { useLocation } from "react-router-dom";

import GlobalSearch from "../../modules/search/components/GlobalSearch";
import NotificationBell from "../../modules/notifications/components/NotificationBell";
import { SidebarMobileToggle } from "../sidebar/Sidebar";
import { findNavigationItemByPath } from "../../navigation/navigation.types";
import { navigationConfig } from "../../navigation/navigation";

/**
 * Derives the current page title from the navigation configuration based on
 * the active route. Falls back to a friendly default when no match is found.
 */
function usePageTitle(): string {
  const location = useLocation();

  // Try exact match first
  const exact = findNavigationItemByPath(navigationConfig, location.pathname);
  if (exact) return exact.name;

  // Try matching by path prefix (e.g. /accounting/ledger → Accounting)
  const segments = location.pathname.split("/").filter(Boolean);
  if (segments.length > 0) {
    const prefix = "/" + segments[0];
    const prefixMatch = findNavigationItemByPath(navigationConfig, prefix);
    if (prefixMatch) return prefixMatch.name;
  }

  return "Dashboard";
}

export default function Header() {
  const pageTitle = usePageTitle();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--nebula-border)] bg-[var(--nebula-surface)] px-6">
      <div className="flex items-center gap-3">
        <SidebarMobileToggle />
        <h2 className="text-lg font-semibold text-[var(--nebula-text-primary)]">
          {pageTitle}
        </h2>
      </div>

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
