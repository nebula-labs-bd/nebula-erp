import { useTheme } from "../../theme/useTheme";
import { Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { useSidebar } from "./SidebarContext";

/**
 * Simplified Sidebar Header.
 * Branding and identity have been moved to the top application header.
 * This component now only serves as a logo container and collapse toggle.
 */
export default function SidebarBrand() {
  const { theme } = useTheme();
  const { collapsed, toggleCollapsed } = useSidebar();

  return (
    <div className={`flex items-center border-b border-[var(--nebula-border)] p-4 ${collapsed ? "justify-center" : "justify-between"}`}>
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 shadow-sm"
        style={{
          background: `linear-gradient(135deg, ${theme.tokens["--nebula-primary"]} 0%, ${theme.tokens["--nebula-accent"]} 100%)`,
        }}
      >
        <Zap className="w-6 h-6 text-white" />
      </div>

      {!collapsed && (
        <button
          type="button"
          onClick={toggleCollapsed}
          className="rounded-lg p-1.5 text-[var(--nebula-text-muted)] transition-colors hover:bg-[var(--nebula-surface-muted)] hover:text-[var(--nebula-text-primary)]"
          aria-label="Collapse sidebar"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {collapsed && (
        <button
          type="button"
          onClick={toggleCollapsed}
          className="absolute -right-3 top-16 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--nebula-border)] bg-[var(--nebula-surface)] text-[var(--nebula-text-muted)] shadow-sm transition-colors hover:text-[var(--nebula-text-primary)] lg:flex"
          aria-label="Expand sidebar"
        >
          <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}
