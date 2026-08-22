import GlobalSearch from "../../modules/search/components/GlobalSearch";
import NotificationBell from "../../modules/notifications/components/NotificationBell";
import { SidebarMobileToggle } from "../sidebar/Sidebar";
import HeaderBrand from "./HeaderBrand";
import CompanySwitcher from "./CompanySwitcher";
import UserMenu from "./UserMenu";

/**
 * Enterprise ERP Application Header.
 * 
 * Features:
 * - Sticky positioning
 * - Glassmorphism effect
 * - Identity & Company Context (Left)
 * - Prominent Global Search (Center)
 * - User & Notifications (Right)
 * - Responsive layout
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center border-b border-[var(--nebula-border)] bg-[var(--nebula-surface)]/80 backdrop-blur-md px-4 lg:px-6">
      {/* Left Zone: Brand & Context */}
      <div className="flex flex-1 items-center gap-4">
        <SidebarMobileToggle />
        <HeaderBrand />
        <div className="hidden h-8 w-px bg-[var(--nebula-border)] lg:block" />
        <div className="hidden lg:block">
          <CompanySwitcher />
        </div>
      </div>

      {/* Center Zone: Search */}
      <div className="hidden max-w-xl flex-[2] justify-center md:flex">
        <GlobalSearch />
      </div>

      {/* Right Zone: Actions & User */}
      <div className="flex flex-1 items-center justify-end gap-2 lg:gap-4">
        {/* Mobile Search Button (only shown on small screens) */}
        <div className="md:hidden">
           {/* We reuse GlobalSearch's modal, but for mobile we'll just show a search icon button */}
           <GlobalSearch />
        </div>

        <NotificationBell />
        
        <div className="hidden h-8 w-px bg-[var(--nebula-border)] lg:block" />
        
        <UserMenu />
      </div>
    </header>
  );
}
