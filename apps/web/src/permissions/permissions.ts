export const permissions = {
  DASHBOARD_VIEW: "dashboard:view",

  INVENTORY_VIEW: "inventory:view",
  INVENTORY_CREATE: "inventory:create",
  INVENTORY_UPDATE: "inventory:update",

  SALES_VIEW: "sales:view",
  SALES_CREATE: "sales:create",

  PURCHASE_VIEW: "purchase:view",

  CRM_VIEW: "crm:view",

  ACCOUNTING_VIEW: "accounting:view",

  RECONCILIATION_VIEW: "reconciliation:view",

  PAYMENTS_VIEW: "payments:view",

  CONTACTS_VIEW: "contacts:view",

  REPORTS_VIEW: "reports:view",

  SETTINGS_MANAGE: "settings:manage",
} as const;

export type Permission =
  (typeof permissions)[keyof typeof permissions];