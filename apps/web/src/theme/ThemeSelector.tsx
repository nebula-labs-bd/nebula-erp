import ThemeOptions from "./ThemeOptions";

/**
 * Theme picker for the settings/appearance area.
 *
 * This is design-system foundation UI only: it renders the list of available
 * themes and applies the selection through the theme engine. It does not change
 * any module logic or redesign existing components.
 */
export default function ThemeSelector() {
  return (
    <section className="surface p-6">
      <h2 className="text-lg font-semibold">Theme</h2>

      <p className="mt-1 text-[var(--nebula-text-secondary)]">
        Choose how Nebula ERP looks. Your selection is saved on this device.
      </p>

      <ThemeOptions className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3" />
    </section>
  );
}

