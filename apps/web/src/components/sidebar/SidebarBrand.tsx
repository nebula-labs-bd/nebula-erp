import type { ReactNode } from "react";
import { useTheme } from "../../theme/useTheme";
import { Building2, User, Circle, Info, ChevronLeft, ChevronRight, Zap } from "lucide-react";
import type { Theme } from "../../theme/themes";
import { appConfig } from "../../config/app.config";
import { defaultCompanyInfo, defaultUserInfo } from "../../config/company.config";
import { useSidebar } from "./SidebarContext";

/**
 * Enterprise sidebar branding component.
 * Displays company identity, user info, system status, and version.
 * Adapts to collapsed/expanded states with tooltips.
 */
export default function SidebarBrand() {
  const { theme } = useTheme();
  const { collapsed, toggleCollapsed } = useSidebar();
  
  const isOnline = defaultCompanyInfo.status === "online";
  const statusColor = isOnline ? "var(--nebula-success)" : "var(--nebula-danger)";

  if (collapsed) {
    return renderCollapsedBrand(theme, toggleCollapsed, statusColor);
  }

  return renderExpandedBrand(theme, toggleCollapsed, statusColor);
}
function renderCollapsedBrand(
  theme: Theme,
  toggleCollapsed: () => void,
  statusColor: string
) {
  return (
    <div className="flex flex-col items-center gap-3 p-3 border-b border-[var(--nebula-border)]">
      <button
        type="button"
        onClick={toggleCollapsed}
        className="flex flex-col items-center gap-1 w-full p-2 rounded-lg transition-colors hover:bg-[var(--nebula-surface-muted)]"
        aria-label="Expand sidebar"
        title={appConfig.name}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${theme.tokens["--nebula-primary"]} 0%, ${theme.tokens["--nebula-accent"]} 100%)` }}
        >
          <Zap className="w-5 h-5 text-white" />
        </div>
        <span className="text-[10px] font-semibold text-center leading-tight text-[var(--nebula-text-primary)]">
          {appConfig.name.split(" ")[0]}
        </span>
        <span className="text-[10px] font-medium text-center leading-tight text-[var(--nebula-text-secondary)]">
          {appConfig.name.split(" ")[1] || ""}
        </span>
      </button>

      <TooltipWrapper content={defaultCompanyInfo.companyName + " - " + defaultCompanyInfo.branchName}>
        <button
          type="button"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--nebula-text-muted)] transition-colors hover:bg-[var(--nebula-surface-muted)] hover:text-[var(--nebula-text-primary)]"
          aria-label="Company information"
        >
          <Building2 className="w-4 h-4" />
        </button>
      </TooltipWrapper>

      <TooltipWrapper content={defaultUserInfo.name + " - " + defaultUserInfo.role}>
        <button
          type="button"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--nebula-text-muted)] transition-colors hover:bg-[var(--nebula-surface-muted)] hover:text-[var(--nebula-text-primary)]"
          aria-label="User information"
        >
          <User className="w-4 h-4" />
        </button>
      </TooltipWrapper>

      <TooltipWrapper content={"System " + defaultCompanyInfo.status.charAt(0).toUpperCase() + defaultCompanyInfo.status.slice(1)}>
        <button
          type="button"
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--nebula-surface-muted)]"
          aria-label="System status"
        >
          <Circle className="w-3 h-3" style={{ color: statusColor }} />
        </button>
      </TooltipWrapper>

      <TooltipWrapper content={appConfig.edition + " - Version " + appConfig.version + " - Build " + appConfig.build}>
        <div className="w-full flex items-center justify-center pt-2 border-t border-[var(--nebula-border)] mt-auto">
          <button
            type="button"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--nebula-text-muted)] transition-colors hover:bg-[var(--nebula-surface-muted)] hover:text-[var(--nebula-text-primary)]"
            aria-label="Version information"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </TooltipWrapper>

      <button
        type="button"
        onClick={toggleCollapsed}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--nebula-text-muted)] transition-colors hover:bg-[var(--nebula-surface-muted)] hover:text-[var(--nebula-text-primary)] mt-2"
        aria-label="Expand sidebar"
        title="Expand sidebar"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function renderExpandedBrand(
  theme: Theme,
  toggleCollapsed: () => void,
  statusColor: string
) {
  return (
    <div className="flex flex-col gap-4 p-4 border-b border-[var(--nebula-border)]">
      {/* Logo & App Name */}
      <button
        type="button"
        onClick={toggleCollapsed}
        className="flex items-center gap-3 w-full p-2 rounded-lg transition-colors hover:bg-[var(--nebula-surface-muted)]"
        aria-label="Collapse sidebar"
      >
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: `linear-gradient(135deg, ${theme.tokens["--nebula-primary"]} 0%, ${theme.tokens["--nebula-accent"]} 100%)` }}
        >
          <Zap className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0 text-left">
          <div className="text-lg font-bold text-[var(--nebula-text-primary)] truncate">
            {appConfig.name}
          </div>
          <div className="text-sm text-[var(--nebula-text-secondary)] truncate">
            Enterprise Platform
          </div>
        </div>
        <ChevronLeft className="w-5 h-5 text-[var(--nebula-text-muted)] shrink-0" />
      </button>

      {/* Company Info */}
      <div className="space-y-2 pt-2 border-t border-[var(--nebula-border)]">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[var(--nebula-text-muted)] shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-xs text-[var(--nebula-text-muted)] uppercase tracking-wider">Company</div>
            <div className="text-sm font-medium text-[var(--nebula-text-primary)] truncate">{defaultCompanyInfo.companyName}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-6">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--nebula-border)] shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-xs text-[var(--nebula-text-muted)] uppercase tracking-wider">Branch</div>
            <div className="text-sm font-medium text-[var(--nebula-text-primary)] truncate">{defaultCompanyInfo.branchName}</div>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="space-y-2 pt-2 border-t border-[var(--nebula-border)]">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-[var(--nebula-text-muted)] shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-xs text-[var(--nebula-text-muted)] uppercase tracking-wider">User</div>
            <div className="text-sm font-medium text-[var(--nebula-text-primary)] truncate">{defaultUserInfo.name}</div>
            <div className="text-xs text-[var(--nebula-text-secondary)] truncate">{defaultUserInfo.role}</div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="space-y-2 pt-2 border-t border-[var(--nebula-border)]">
        <div className="flex items-center gap-2">
          <Circle className="w-4 h-4 shrink-0" style={{ color: statusColor }} />
          <div className="flex-1 min-w-0">
            <div className="text-xs text-[var(--nebula-text-muted)] uppercase tracking-wider">System Status</div>
            <div className="text-sm font-medium text-[var(--nebula-text-primary)] truncate flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColor }} />
              System {defaultCompanyInfo.status.charAt(0).toUpperCase() + defaultCompanyInfo.status.slice(1)}
            </div>
          </div>
        </div>
      </div>

      {/* Version Info */}
      <div className="space-y-1 pt-2 border-t border-[var(--nebula-border)]">
        <div className="text-xs text-[var(--nebula-text-muted)] uppercase tracking-wider">
          {appConfig.edition}
        </div>
        <div className="text-sm font-medium text-[var(--nebula-text-primary)]">
          Version {appConfig.version}
        </div>
        <div className="text-xs text-[var(--nebula-text-muted)]">
          Build {appConfig.build}
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        type="button"
        onClick={toggleCollapsed}
        className="w-full flex items-center justify-center gap-2 p-2 rounded-lg text-[var(--nebula-text-secondary)] transition-colors hover:bg-[var(--nebula-surface-muted)] hover:text-[var(--nebula-text-primary)] mt-2"
        aria-label="Collapse sidebar"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Collapse</span>
      </button>
    </div>
  );
}

/**
 * Simple tooltip wrapper component for collapsed sidebar.
 * Shows content on hover, positioned to the right of the trigger.
 */
function TooltipWrapper({ children, content }: { children: ReactNode; content: string }) {
  return (
    <div className="relative group w-full flex items-center justify-center">
      {children}
      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-[var(--nebula-surface)] border border-[var(--nebula-border)] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 text-xs">
        <div className="text-[var(--nebula-text-primary)]">{content}</div>
      </div>
    </div>
  );
}