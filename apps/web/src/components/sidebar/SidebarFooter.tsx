import { useTheme } from "../../theme/useTheme";
import { themeList } from "../../theme/themes";
import type { ThemeId } from "../../theme/themes";
import SystemStatus from "../system/SystemStatus";
import { ChevronUp, Palette, Info } from "lucide-react";
import { useState, useRef, useEffect } from "react";

/**
 * Sidebar Footer Component
 *
 * Pinned at the bottom of the sidebar, always visible.
 * Navigation area scrolls independently while footer stays fixed.
 *
 * Expanded mode shows:
 * - System Status with animated indicator
 * - ERP Edition label
 * - Version and Build information
 * - Compact theme selector (Palette icon + dropdown)
 *
 * Collapsed mode shows:
 * - Status indicator only
 * - Small version indicator
 * - Theme icon with hover tooltip revealing full info
 */
export default function SidebarFooter({ collapsed = false }: { collapsed?: boolean }) {
  const { themeId, setTheme } = useTheme();
  const [themePopoverOpen, setThemePopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Version and build info - could be injected from build process
  const version = "1.0.0";
  const build = "2026.08";
  const edition = "Enterprise Edition";
  const productName = "Nebula ERP";

  // Close popover on outside click
  useEffect(() => {
    if (!themePopoverOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (!popoverRef.current?.contains(event.target as Node)) {
        setThemePopoverOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setThemePopoverOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [themePopoverOpen]);

  const activeTheme = themeList.find((t) => t.id === themeId);

  if (collapsed) {
    return (
      <footer
        className="relative flex-shrink-0 border-t border-[var(--nebula-border)] p-3 transition-all duration-300"
        role="contentinfo"
        aria-label="Sidebar footer"
      >
        {/* System Status - Compact */}
        <div className="flex items-center justify-center mb-3">
          <SystemStatus variant="online" compact />
        </div>

        {/* Version Indicator - Compact */}
        <div className="flex items-center justify-center mb-3">
          <span
            className="text-[10px] font-medium text-[var(--nebula-text-muted)] tracking-wider uppercase"
            title={`${productName} v${version}`}
            aria-label={`${productName} version ${version}`}
          >
            v{version}
          </span>
        </div>

        {/* Theme Selector - Compact with hover tooltip */}
        <div className="relative group" ref={tooltipRef}>
          <button
            type="button"
            onClick={() => setThemePopoverOpen((prev) => !prev)}
            aria-haspopup="menu"
            aria-expanded={themePopoverOpen}
            aria-label="Theme selector"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--nebula-border)] px-3 py-2 text-sm text-[var(--nebula-text-secondary)] transition-colors hover:bg-[var(--nebula-surface-muted)]"
          >
            <Palette size={16} className="text-[var(--nebula-primary)]" />
          </button>

          {/* Tooltip on hover - shows full info */}
          <div
            className="absolute left-full top-1/2 -translate-y-1/2 ml-3 w-56 p-3 bg-[var(--nebula-surface)] border border-[var(--nebula-border)] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none"
            role="tooltip"
          >
            <div className="space-y-2 text-left">
              <div className="flex items-center gap-2">
                <Info size={14} className="text-[var(--nebula-primary)] shrink-0" />
                <span className="font-semibold text-[var(--nebula-text-primary)]">{productName}</span>
              </div>
              <div className="text-xs text-[var(--nebula-text-secondary)]">{edition}</div>
              <div className="border-t border-[var(--nebula-border)] pt-2 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--nebula-text-muted)]">Version</span>
                  <span className="font-mono text-[var(--nebula-text-primary)]">{version}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--nebula-text-muted)]">Build</span>
                  <span className="font-mono text-[var(--nebula-text-primary)]">{build}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Theme Popover — floats beside the collapsed rail */}
          {themePopoverOpen && (
            <div
              ref={popoverRef}
              role="menu"
              className="nebula-pop-in absolute bottom-full left-1/2 z-50 mb-2 w-44 -translate-x-1/2 border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-2 rounded-lg shadow-[var(--nebula-shadow-lg)]"
            >
              <div className="mb-1 px-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--nebula-text-muted)]">
                SELECT THEME
              </div>
              <div className="grid grid-cols-4 gap-2">
                {themeList.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    role="menuitemradio"
                    aria-checked={t.id === themeId}
                    onClick={() => {
                      setTheme(t.id as ThemeId);
                      setThemePopoverOpen(false);
                    }}
                    className={`aspect-square rounded-full transition-all duration-200 hover:scale-110 ${
                      t.id === themeId
                        ? "ring-2 ring-[var(--nebula-primary)] ring-offset-2 ring-offset-[var(--nebula-surface)]"
                        : "ring-1 ring-black/10"
                    }`}
                    style={{ backgroundColor: t.tokens["--nebula-primary"] }}
                    aria-label={t.name}
                    title={t.name}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </footer>
    );
  }

  // Expanded mode
  return (
    <footer
      className="flex-shrink-0 border-t border-[var(--nebula-border)] p-3 transition-all duration-300"
      role="contentinfo"
      aria-label="Sidebar footer"
    >
      {/* System Status Section */}
      <div className="mb-4">
        <div className="text-[10px] font-semibold text-[var(--nebula-text-muted)] uppercase tracking-wider mb-2">
          SYSTEM STATUS
        </div>
        <SystemStatus variant="online" showLabel />
      </div>

      {/* ERP Edition Section */}
      <div className="mb-4">
        <div className="text-[10px] font-semibold text-[var(--nebula-text-muted)] uppercase tracking-wider mb-2">
          ERP EDITION
        </div>
        <div className="space-y-1">
          <div className="font-semibold text-[var(--nebula-text-primary)] text-sm">{productName}</div>
          <div className="text-xs text-[var(--nebula-text-secondary)]">{edition}</div>
        </div>
      </div>

      {/* Version & Build Info */}
      <div className="mb-4 pt-3 border-t border-[var(--nebula-border)]">
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div>
            <span className="text-[var(--nebula-text-muted)]">Version</span>
            <div className="font-mono text-[var(--nebula-text-primary)]">{version}</div>
          </div>
          <div>
            <span className="text-[var(--nebula-text-muted)]">Build</span>
            <div className="font-mono text-[var(--nebula-text-primary)]">{build}</div>
          </div>
        </div>
      </div>

      {/* Compact Theme Selector */}
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[10px] font-semibold text-[var(--nebula-text-muted)] uppercase tracking-wider">
            THEME
          </div>
          <button
            type="button"
            onClick={() => setThemePopoverOpen((prev) => !prev)}
            aria-haspopup="menu"
            aria-expanded={themePopoverOpen}
            aria-label="Open theme selector"
            className="p-1 rounded text-[var(--nebula-text-muted)] hover:text-[var(--nebula-text-primary)] transition-colors"
          >
            <ChevronUp size={12} className={`transition-transform ${themePopoverOpen ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Current theme indicator */}
        <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--nebula-surface-muted)] mb-2">
          <div
            className="w-5 h-5 rounded-full ring-1 ring-black/10 shrink-0"
            style={{ backgroundColor: activeTheme?.tokens["--nebula-primary"] }}
            aria-hidden="true"
          />
          <span className="text-sm font-medium text-[var(--nebula-text-primary)] truncate">
            {activeTheme?.name}
          </span>
        </div>

        {/* Theme Popover - Floating 2-row Palette (fade + scale, no layout shift) */}
        {themePopoverOpen && (
          <div
            ref={popoverRef}
            role="menu"
            className="nebula-pop-in absolute bottom-full left-0 mb-2 z-50 w-56 border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-3 rounded-lg shadow-[var(--nebula-shadow-lg)]"
          >
            <div className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--nebula-text-muted)]">
              SELECT THEME
            </div>
            <div className="grid grid-cols-4 gap-2">
              {themeList.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="menuitemradio"
                  aria-checked={t.id === themeId}
                  onClick={() => {
                    setTheme(t.id as ThemeId);
                    setThemePopoverOpen(false);
                  }}
                  className={`aspect-square rounded-full transition-all duration-200 hover:scale-110 ${
                    t.id === themeId
                      ? "ring-2 ring-[var(--nebula-primary)] ring-offset-2 ring-offset-[var(--nebula-surface)]"
                      : "ring-1 ring-black/10"
                  }`}
                  style={{ backgroundColor: t.tokens["--nebula-primary"] }}
                  aria-label={t.name}
                  title={t.name}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Smaller muted version line, pinned at the very bottom */}
      <div className="mt-3 border-t border-[var(--nebula-border)] pt-2 text-center">
        <span className="text-[10px] font-medium tracking-wider text-[var(--nebula-text-muted)] uppercase">
          {productName} v{version} · {build}
        </span>
      </div>
    </footer>
  );
}