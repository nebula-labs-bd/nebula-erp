import { createContext, useContext, useState, type ReactNode } from "react";

/**
 * Shared sidebar UI state so the Header (mobile hamburger) and the
 * Sidebar itself stay in sync without prop-drilling.
 */
export interface SidebarContextValue {
  /** Whether the sidebar is collapsed (icon-only) on desktop. */
  collapsed: boolean;
  /** Open/close the collapsed rail. */
  setCollapsed: (value: boolean) => void;
  /** Toggle the collapsed rail. */
  toggleCollapsed: () => void;
  /** Whether the mobile drawer is open. */
  mobileOpen: boolean;
  /** Open/close the mobile drawer. */
  setMobileOpen: (value: boolean) => void;
}

export const SidebarContext = createContext<SidebarContextValue | null>(null);

const COLLAPSED_STORAGE_KEY = "nebula-sidebar-collapsed";

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsedState] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      const stored = window.localStorage.getItem(COLLAPSED_STORAGE_KEY);
      return stored !== null ? JSON.parse(stored) : false;
    } catch {
      return false;
    }
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  const setCollapsed = (value: boolean) => {
    setCollapsedState(value);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(COLLAPSED_STORAGE_KEY, JSON.stringify(value));
    }
  };

  const toggleCollapsed = () => setCollapsed(!collapsed);

  return (
    <SidebarContext.Provider
      value={{
        collapsed,
        setCollapsed,
        toggleCollapsed,
        mobileOpen,
        setMobileOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar(): SidebarContextValue {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return ctx;
}
