import { useTheme } from "./useTheme";

/**
 * Theme picker for the settings/appearance area.
 *
 * This is design-system foundation UI only: it renders the list of available
 * themes and applies the selection through the theme engine. It does not change
 * any module logic or redesign existing components.
 */
export default function ThemeSelector() {
  const { themeId, themes, setTheme } = useTheme();

  return (
    <section className="surface p-6">
      <h2 className="text-lg font-semibold">Theme</h2>

      <p className="mt-1 text-[var(--nebula-text-secondary)]">
        Choose how Nebula ERP looks. Your selection is saved on this device.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {themes.map((theme) => {
          const active = theme.id === themeId;

          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => setTheme(theme.id)}
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
    </section>
  );
}
