/**
 * Company information structure for Nebula ERP.
 * This provides a reusable foundation for multi-company support.
 * Currently uses safe fallback values; architecture allows replacing with API data later.
 */
export interface CompanyInfo {
  companyName: string;
  branchName: string;
  logo?: string;
  status: "online" | "offline" | "maintenance";
}

/**
 * Default company information - fallback values for development
 * These will be replaced by API data in future backend integration
 */
export const defaultCompanyInfo: CompanyInfo = {
  companyName: "CamneX Bangladesh",
  branchName: "Main Branch",
  status: "online",
} as const;

/**
 * User information structure for sidebar branding
 */
export interface UserInfo {
  name: string;
  role: string;
  avatar?: string;
}

export const defaultUserInfo: UserInfo = {
  name: "Admin User",
  role: "Administrator",
} as const;