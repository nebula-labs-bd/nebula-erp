import { useState, useRef, useEffect } from "react";
import { Building2, ChevronDown, Check } from "lucide-react";
import { defaultCompanyInfo } from "../../config/company.config";

/**
 * Company and Branch switcher for the application header.
 * Displays the current context and allows switching between branches/companies.
 * Mock implementation ready for future multi-company backend integration.
 */
export default function CompanySwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const branches = [
    { id: "main", name: "Main Branch", active: true },
    { id: "dhaka", name: "Dhaka Branch", active: false },
    { id: "chittagong", name: "Chittagong Branch", active: false },
  ];

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-[var(--nebula-surface-muted)]"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--nebula-surface-muted)] text-[var(--nebula-text-secondary)] transition-colors group-hover:text-[var(--nebula-primary)]">
          <Building2 size={18} />
        </div>
        
        <div className="flex flex-col items-start leading-tight">
          <div className="flex items-center gap-1">
            <span className="text-sm font-semibold text-[var(--nebula-text-primary)]">
              {defaultCompanyInfo.companyName}
            </span>
            <ChevronDown size={14} className={`text-[var(--nebula-text-muted)] transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </div>
          <span className="text-xs text-[var(--nebula-text-secondary)]">
            {defaultCompanyInfo.branchName}
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 z-50 w-64 overflow-hidden rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] shadow-[var(--nebula-shadow-lg)]">
          <div className="p-3 border-b border-[var(--nebula-border)] bg-[var(--nebula-surface-muted)]/50">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--nebula-text-muted)]">Current Company</p>
            <p className="mt-1 text-sm font-bold text-[var(--nebula-text-primary)]">{defaultCompanyInfo.companyName}</p>
          </div>

          <div className="p-1">
            <div className="px-3 py-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--nebula-text-muted)]">Branches</p>
            </div>
            
            {branches.map((branch) => (
              <button
                key={branch.id}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-[var(--nebula-surface-muted)]"
              >
                <span className={branch.active ? "font-semibold text-[var(--nebula-primary)]" : "text-[var(--nebula-text-secondary)]"}>
                  {branch.name}
                </span>
                {branch.active && <Check size={14} className="text-[var(--nebula-primary)]" />}
              </button>
            ))}
          </div>

          <div className="border-t border-[var(--nebula-border)] p-1">
            <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-[var(--nebula-text-secondary)] transition-colors hover:bg-[var(--nebula-surface-muted)] hover:text-[var(--nebula-text-primary)]">
              Manage Company
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
