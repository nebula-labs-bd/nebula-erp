import type { Permission } from "./permissions";
import { roles, type Role } from "./roles";
import { permissions } from "./permissions";

export const rolePermissions: Record<
  Role,
  Permission[]
> = {
  [roles.ADMIN]: Object.values(permissions),

  [roles.MANAGER]: [
    permissions.DASHBOARD_VIEW,

    permissions.INVENTORY_VIEW,
    permissions.INVENTORY_CREATE,
    permissions.INVENTORY_UPDATE,

    permissions.SALES_VIEW,
    permissions.SALES_CREATE,

    permissions.PURCHASE_VIEW,

    permissions.CRM_VIEW,

    permissions.ACCOUNTING_VIEW,

    permissions.RECONCILIATION_VIEW,

    permissions.PAYMENTS_VIEW,

    permissions.CONTACTS_VIEW,

    permissions.EXPENSES_VIEW,

    permissions.ASSETS_VIEW,

    permissions.REPORTS_VIEW,

    permissions.POS_VIEW,
  ],

  [roles.STAFF]: [
    permissions.DASHBOARD_VIEW,

    permissions.INVENTORY_VIEW,

    permissions.SALES_VIEW,
    permissions.SALES_CREATE,

    permissions.CRM_VIEW,

    permissions.POS_VIEW,
  ],

  [roles.VIEWER]: [
    permissions.DASHBOARD_VIEW,
  ],
};