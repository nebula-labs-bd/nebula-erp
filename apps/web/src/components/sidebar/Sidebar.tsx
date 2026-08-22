import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

import { ChevronDown, Menu } from "lucide-react";

import { getVisibleNavigationItems } from "../../navigation/navigation";
import type { NavigationItem } from "../../navigation/navigation.types";

import usePermission from "../../hooks/usePermission";

import { useSidebar } from "./SidebarContext";
import { getIconComponent } from "./NavigationIcons";
import SidebarBrand from "./SidebarBrand";
import SidebarFooter from "./SidebarFooter";

const OPEN_GROUPS_STORAGE_KEY = "nebula-sidebar-open-groups";

/**
 * Enterprise ERP navigation sidebar.
 *
 * Features:
 * - Configuration-driven (see src/navigation/navigation.ts)
 * - Group expand/collapse with accordion behavior
 * - Open groups persisted to localStorage
 * - Permission-based visibility
 * - Active route highlighting
 * - Collapsed (icon-only) mode with tooltips
 * - Responsive: desktop sidebar, mobile drawer
 * - Theme switcher stays at the bottom
 */
function SidebarContent() {
  const { can } = usePermission();
  const location = useLocation();
  const { collapsed, mobileOpen, setMobileOpen, setCollapsed } = useSidebar();

  const [openGroups, setOpenGroups] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const stored = window.localStorage.getItem(OPEN_GROUPS_STORAGE_KEY);
      return stored ? new Set(JSON.parse(stored) as string[]) : new Set();
    } catch {
      return new Set();
    }
  });

  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      OPEN_GROUPS_STORAGE_KEY,
      JSON.stringify([...openGroups]),
    );
  }, [openGroups]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, setMobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    function handlePointerDown(event: PointerEvent) {
      if (!sidebarRef.current?.contains(event.target as Node)) {
        setMobileOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen, setMobileOpen]);

  const visibleItems = getVisibleNavigationItems(can);

  /**
   * Part 2: clicking a group icon while the rail is collapsed should
   * auto-expand the sidebar, open the group and reveal its items — but keep
   * the current route (no navigation). The width transition is handled by the
   * <aside> `transition-[width]` class.
   */
  const openGroupFromCollapsed = (groupId: string) => {
    if (collapsed) {
      setCollapsed(false);
    }
    setOpenGroups(new Set([groupId]));
  };

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        // Accordion: only one group open at a time.
        next.clear();
        next.add(groupId);
      }
      return next;
    });
  };

  const isGroupOpen = (groupId: string) => openGroups.has(groupId);
  const isPathActive = (path: string) => location.pathname === path;

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        ref={sidebarRef}
        className={[
          "flex h-screen flex-col border-r border-[var(--nebula-border)] bg-[var(--nebula-surface)]",
          "fixed inset-y-0 left-0 z-50 transition-[width,transform] duration-300 ease-in-out lg:static lg:translate-x-0",
          collapsed ? "w-[72px]" : "w-[260px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        aria-label="Main navigation"
      >
        {/* Brand Header */}
        <SidebarBrand />

        {/* Navigation Area - scrollable, independent from page scroll */}
        <nav className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden p-3" aria-label="Primary">
          {visibleItems.map((item) => (
            <NavigationItemNode
              key={item.id}
              item={item}
              isActive={isPathActive(item.path || "")}
              onGroupToggle={toggleGroup}
              onExpandFromCollapsed={openGroupFromCollapsed}
              isGroupOpen={isGroupOpen}
              collapsed={collapsed}
            />
          ))}
        </nav>

        {/* Footer Area - always visible at bottom */}
        <SidebarFooter collapsed={collapsed} />
      </aside>
    </>
  );
}
function NavigationItemNode({
  item,
  isActive,
  onGroupToggle,
  onExpandFromCollapsed,
  isGroupOpen,
  collapsed,
}: {
  item: NavigationItem;
  isActive: boolean;
  onGroupToggle: (groupId: string) => void;
  onExpandFromCollapsed: (groupId: string) => void;
  isGroupOpen: (groupId: string) => boolean;
  collapsed: boolean;
}) {
  const location = useLocation();
  const Icon = getIconComponent(item.icon);

  if (item.type === "link") {
    return (
      <NavLink
        to={item.path}
        title={collapsed ? item.name : undefined}
        aria-current={isActive ? "page" : undefined}
        className={({ isActive: active }) =>
          [
            "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out",
            collapsed ? "justify-center" : "",
            active
              ? "bg-[var(--nebula-primary)] text-white shadow-sm"
              : "text-[var(--nebula-text-secondary)] hover:bg-[var(--nebula-surface-muted)] hover:text-[var(--nebula-text-primary)]",
          ].join(" ")
        }
      >
        {({ isActive: active }) => (
          <>
            {/* Animated active indicator */}
            {active && !collapsed && (
              <span
                className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-[var(--nebula-accent)] transition-all duration-200"
                aria-hidden="true"
              />
            )}
            <Icon
              size={20}
              className={`shrink-0 transition-transform duration-200 ease-in-out ${active ? "scale-110" : "group-hover:translate-x-0.5"}`}
            />
            {!collapsed && <span className="truncate transition-colors duration-200">{item.name}</span>}
          </>
        )}
      </NavLink>
    );
  }

  // Group item
  const open = isGroupOpen(item.id);
  const hasActiveChild = item.children.some(
    (child) => location.pathname === child.path,
  );

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() =>
          collapsed
            ? onExpandFromCollapsed(item.id)
            : onGroupToggle(item.id)
        }
        aria-expanded={open}
        aria-controls={`${item.id}-children`}
        title={collapsed ? item.name : undefined}
        className={[
          "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out",
          collapsed ? "justify-center" : "",
          hasActiveChild
            ? "text-[var(--nebula-primary)] hover:bg-[var(--nebula-surface-muted)]"
            : "text-[var(--nebula-text-secondary)] hover:bg-[var(--nebula-surface-muted)] hover:text-[var(--nebula-text-primary)]",
        ].join(" ")}
      >
        <Icon
          size={20}
          className={`shrink-0 transition-transform duration-200 ease-in-out ${open ? "scale-110" : "group-hover:translate-x-0.5"}`}
        />
        {!collapsed && (
          <>
            <span className="flex-1 truncate text-left">{item.name}</span>
            <ChevronDown
              size={16}
              className={`shrink-0 text-[var(--nebula-text-muted)] transition-transform duration-200 ease-in-out ${open ? "rotate-180" : ""}`}
            />
          </>
        )}
      </button>

      {!collapsed && (
        <div
          id={`${item.id}-children`}
          role="group"
          aria-label={`${item.name} submenu`}
          className={`grid transition-all duration-250 ease-in-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
        >
          <div className="overflow-hidden">
            <div
              className={`ml-5 space-y-0.5 border-l-2 border-[var(--nebula-border)] pl-2 transition-transform duration-200 ease-in-out ${open ? "translate-y-0" : "-translate-y-1"}`}
            >
              {item.children.map((child) => (
                <NavLink
                  key={child.id}
                  to={child.path}
                  aria-current={
                    location.pathname === child.path ? "page" : undefined
                  }
                  className={({ isActive: active }) =>
                    [
                      "group relative flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition-all duration-200 ease-in-out",
                      active
                        ? "bg-[var(--nebula-primary)] text-white"
                        : "text-[var(--nebula-text-secondary)] hover:bg-[var(--nebula-surface-muted)] hover:text-[var(--nebula-text-primary)]",
                    ].join(" ")
                  }
                >
                  {({ isActive: active }) => (
                    <>
                      {active && (
                        <span
                          className="nebula-rail-pulse absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-[var(--nebula-accent)]"
                          aria-hidden="true"
                        />
                      )}
                      {(() => {
                        const ChildIcon = getIconComponent(child.icon);
                        return (
                          <ChildIcon
                            size={18}
                            className={`shrink-0 transition-transform duration-200 ${active ? "scale-110" : "group-hover:translate-x-0.5"}`}
                          />
                        );
                      })()}
                      <span className="truncate">{child.name}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}

      {collapsed && (
        <div className="relative group/collapsed">
          {/* Floating submenu on hover */}
          <div className="absolute left-full top-0 ml-2 w-48 rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-2 shadow-lg opacity-0 invisible group-hover/collapsed:opacity-100 group-hover/collapsed:visible transition-all duration-200 z-50">
            <div className="mb-1 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--nebula-text-muted)]">
              {item.name}
            </div>
            {item.children.map((child) => (
              <NavLink
                key={child.id}
                to={child.path}
                aria-current={
                  location.pathname === child.path ? "page" : undefined
                }
                className={({ isActive: active }) =>
                  [
                    "flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors",
                    active
                      ? "bg-[var(--nebula-primary)] text-white"
                      : "text-[var(--nebula-text-secondary)] hover:bg-[var(--nebula-surface-muted)] hover:text-[var(--nebula-text-primary)]",
                  ].join(" ")
                }
              >
                {(() => {
                  const ChildIcon = getIconComponent(child.icon);
                  return <ChildIcon size={18} className="shrink-0" />;
                })()}
                <span className="truncate">{child.name}</span>
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** Mobile hamburger button — placed in the Header. */
export function SidebarMobileToggle() {
  const { setMobileOpen } = useSidebar();
  return (
    <button
      type="button"
      onClick={() => setMobileOpen(true)}
      className="p-2 text-[var(--nebula-text-secondary)] transition-colors hover:bg-[var(--nebula-surface-muted)] lg:hidden"
      aria-label="Open navigation"
    >
      <Menu size={20} />
    </button>
  );
}

export default function Sidebar() {
  return (
    <SidebarContent />
  );
}
