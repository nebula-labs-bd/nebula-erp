export interface SystemSetting {
  id: string;
  key: string;
  value: string;
  category: string;
}

export interface SettingsOverview {
  companyName: string;
  currency: string;
  timezone: string;
}