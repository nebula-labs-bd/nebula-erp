import { apiClient } from "../../../api/client";

import type {
  SystemSetting,
  SettingsOverview,
} from "../types/settings.types";


export function getSystemSettings() {
  return apiClient.get<SystemSetting[]>(
    "/settings/system",
  );
}


export function getSettingsOverview() {
  return apiClient.get<SettingsOverview>(
    "/settings/overview",
  );
}