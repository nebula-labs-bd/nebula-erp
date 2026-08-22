import { useState, useRef, useEffect, useContext } from "react";
import { User, ChevronDown, UserCircle, Activity, Settings, Shield, LogOut } from "lucide-react";
import { AuthContext } from "../../auth/auth.context";

/**
 * User Profile Menu for the application header.
 * Displays user identity and provides a dropdown with profile-related actions.
 * Permission-aware menu items based on the user's role.
 */
export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const auth = useContext(AuthContext);

  const user = auth?.user;
  const isAdmin = user?.role === "admin";

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    auth?.logout();
  };

  if (!user) return null;

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full p-1 transition-all hover:bg-[var(--nebula-surface-muted)]"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--nebula-primary)] text-white shadow-sm ring-2 ring-[var(--nebula-surface)]">
          <User size={18} />
        </div>
        
        <div className="hidden items-center gap-1 pr-1 lg:flex">
          <span className="text-sm font-semibold text-[var(--nebula-text-primary)]">
            {user.name}
          </span>
          <ChevronDown size={14} className={`text-[var(--nebula-text-muted)] transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </button>

      {isOpen && (
        <div className="nebula-drop-in absolute right-0 mt-2 z-50 w-60 origin-top-right overflow-hidden rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] shadow-[var(--nebula-shadow-lg)]">
          <div className="flex items-center gap-3 border-b border-[var(--nebula-border)] bg-[var(--nebula-surface-muted)]/30 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--nebula-primary)] text-white shadow-sm ring-2 ring-[var(--nebula-surface)]">
              <User size={20} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-[var(--nebula-text-primary)]">{user.name}</p>
              <p className="text-xs capitalize text-[var(--nebula-text-secondary)]">{user.role}</p>
            </div>
          </div>

          <div className="p-1.5">
            <MenuLink
              icon={<UserCircle size={16} />}
              label={isAdmin ? "Edit Profile" : "View Profile"}
              editable={isAdmin}
            />
            <MenuLink icon={<Activity size={16} />} label="Activity Log" />
            <MenuLink icon={<Settings size={16} />} label="Preferences" />
            <MenuLink icon={<Shield size={16} />} label="Security" />
          </div>

          <div className="border-t border-[var(--nebula-border)] p-1.5">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--nebula-danger)] transition-colors hover:bg-[var(--nebula-danger)]/5"
            >
              <LogOut size={16} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuLink({
  icon,
  label,
  editable = false,
}: {
  icon: React.ReactNode;
  label: string;
  editable?: boolean;
}) {
  return (
    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--nebula-text-secondary)] transition-colors hover:bg-[var(--nebula-surface-muted)] hover:text-[var(--nebula-text-primary)]">
      <span className="text-[var(--nebula-text-muted)]">{icon}</span>
      <span className="flex-1 text-left font-medium">{label}</span>

      {editable && (
        <span className="rounded bg-[var(--nebula-primary)]/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--nebula-primary)]">
          Edit
        </span>
      )}
    </button>
  );
}
