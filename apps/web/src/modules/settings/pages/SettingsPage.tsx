import ThemeSelector from "../../../theme/ThemeSelector";
import SettingsPanel from "../components/SettingsPanel";

import type {
  SystemSetting,
} from "../types/settings.types";


const demoSettings: SystemSetting[] = [
  {
    id: "1",
    key: "company_name",
    value: "Nebula ERP",
    category: "General",
  },
  {
    id: "2",
    key: "currency",
    value: "USD",
    category: "Finance",
  },
];


export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Settings Module
        </h1>

        <p className="mt-2 text-[var(--nebula-text-secondary)]">
          Configure system preferences.
        </p>
      </div>

      <ThemeSelector />

      <SettingsPanel
        settings={demoSettings}
      />
    </div>
  );
}