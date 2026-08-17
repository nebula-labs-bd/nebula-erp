import { useTheme } from "./useTheme";

type ThemeOptionsProps = {
  /** Container grid classes. Defaults to a single-column list. */
  className?: string;
  /** Invoked after a theme is chosen (e.g. to close a popover). */
  onSelect?: () => void;
};

/**
 * Renders the list of selectable themes using the active theme engine.
 *
 * This is the shared theme-switching UI reused by both the Settings page
 * selector and the sidebar quick switcher. Selecting a theme calls `setTheme`,
 * which updates the application instantly and persists the choice.
 */
export default function ThemeOptions({ className, onSelect }: ThemeOptionsProps) {
  const { themeId, themes, setTheme } = useTheme();

  return (
    <div className={className ?? "grid grid-cols-1 gap-2"}>
      {themes.map((theme) => {
        const active = theme.id === themeId;

        return (
          <button
            key={theme.id}
            type="button"
            onClick={() => {
              setTheme(theme.id);
              onSelect?.();
            }}
            aria-pressed={active}
            className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
              active
                ? "border-[var(--nebula-primary)]"
                : "border-[var(--nebula-border)] hover:bg-[var(--nebula-surface-muted)]"
            }`}
          >
            <span
              className="h-8 w-8 shrink-0 rounded-full ring-1 ring-black/10"
              style={{
                background: `linear-gradient(135deg, ${theme.tokens["--nebula-primary"]} 0 50%, ${theme.tokens["--nebula-accent"]} 50% 100%)`,
              }}
            />

            <span className="min-w-0">
              <span className="block text-sm font-medium">{theme.name}</span>

              <span className="block text-xs text-[var(--nebula-text-muted)]">
                {active ? "Active" : "Select"}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
