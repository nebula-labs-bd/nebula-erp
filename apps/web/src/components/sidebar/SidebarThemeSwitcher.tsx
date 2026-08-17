import { useEffect, useRef, useState } from "react";
import { Palette, ChevronUp } from "lucide-react";

import { useTheme } from "../../theme/useTheme";
import ThemeOptions from "../../theme/ThemeOptions";

/**
 * Quick theme switcher for the sidebar footer.
 *
 * Renders a button with a palette icon showing the current theme; clicking it
 * opens a compact popover that lists all six themes. Selecting a theme switches
 * the application instantly (the theme engine also persists the choice).
 *
 * This reuses the shared ThemeOptions UI and does not change any business logic.
 */
export default function SidebarThemeSwitcher() {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex w-full items-center gap-2 rounded-lg border border-[var(--nebula-border)] px-3 py-2 text-sm text-[var(--nebula-text-secondary)] transition-colors hover:bg-[var(--nebula-surface-muted)]"
      >
        <Palette
          size={16}
          className="text-[var(--nebula-primary)]"
        />

        <span className="min-w-0 flex-1 truncate text-left font-medium">
          {theme.name}
        </span>

        <span
          className="h-4 w-4 shrink-0 rounded-full ring-1 ring-black/10"
          style={{
            background: `linear-gradient(135deg, ${theme.tokens["--nebula-primary"]} 0 50%, ${theme.tokens["--nebula-accent"]} 50% 100%)`,
          }}
        />

        <ChevronUp
          size={16}
          className={`transition-transform ${open ? "" : "rotate-180"}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="surface absolute bottom-full left-0 z-20 mb-2 w-64 p-2"
        >
          <ThemeOptions
            className="grid grid-cols-1 gap-2"
            onSelect={() => setOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
