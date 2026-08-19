import { useTheme } from "../../theme/useTheme";
import { themeList } from "../../theme/themes";
import type { ThemeId } from "../../theme/themes";

/**
 * Compact theme quick-switcher rendered as a row of color dots.
 *
 * Replaces the larger SidebarThemeSwitcher dropdown in the sidebar footer.
 * Each dot represents one of the six themes; the active theme is highlighted
 * with a ring. Hovering a dot shows the theme name in a tooltip.
 *
 * The full theme selector remains available in Settings → Appearance.
 */
export default function SidebarThemeDots({ collapsed = false }: { collapsed?: boolean }) {
  const { themeId, setTheme } = useTheme();

  if (collapsed) {
    // Collapsed: show the current theme color as a single dot with tooltip
    const active = themeList.find((t) => t.id === themeId);
    return (
      <div className="relative group flex justify-center">
        <button
          type="button"
          onClick={() => setTheme(themeId)}
          className="w-6 h-6 rounded-full ring-2 ring-[var(--nebula-primary)] ring-offset-2 ring-offset-[var(--nebula-surface)] transition-transform hover:scale-110"
          style={{ backgroundColor: active?.tokens["--nebula-primary"] }}
          aria-label={`Theme: ${active?.name}`}
          title={active?.name}
        />
        {/* Floating dots popover on hover */}
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 p-2 bg-[var(--nebula-surface)] border border-[var(--nebula-border)] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <div className="grid grid-cols-3 gap-2">
            {themeList.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id as ThemeId)}
                className={`w-5 h-5 rounded-full transition-transform hover:scale-110 ${t.id === themeId ? "ring-2 ring-[var(--nebula-primary)] ring-offset-1 ring-offset-[var(--nebula-surface)]" : "ring-1 ring-black/10"}`}
                style={{ backgroundColor: t.tokens["--nebula-primary"] }}
                aria-label={t.name}
                title={t.name}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Expanded: show label + six dots
  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs font-medium text-[var(--nebula-text-muted)] uppercase tracking-wider px-1">
        Theme
      </div>
      <div className="grid grid-cols-6 gap-2 px-1">
        {themeList.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTheme(t.id as ThemeId)}
            className={`w-6 h-6 rounded-full transition-all duration-200 hover:scale-110 ${t.id === themeId ? "ring-2 ring-[var(--nebula-primary)] ring-offset-2 ring-offset-[var(--nebula-surface)]" : "ring-1 ring-black/10"}`}
            style={{ backgroundColor: t.tokens["--nebula-primary"] }}
            aria-label={t.name}
            aria-pressed={t.id === themeId}
            title={t.name}
          />
        ))}
      </div>
    </div>
  );
}
