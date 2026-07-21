import type {
  SystemSetting,
} from "../types/settings.types";


type SettingsPanelProps = {
  settings: SystemSetting[];
};


export default function SettingsPanel({
  settings,
}: SettingsPanelProps) {
  return (
    <div className="surface overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">
              Key
            </th>

            <th className="p-3 text-left">
              Value
            </th>

            <th className="p-3 text-left">
              Category
            </th>
          </tr>
        </thead>

        <tbody>
          {settings.map((setting) => (
            <tr
              key={setting.id}
              className="border-b"
            >
              <td className="p-3">
                {setting.key}
              </td>

              <td className="p-3">
                {setting.value}
              </td>

              <td className="p-3">
                {setting.category}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}