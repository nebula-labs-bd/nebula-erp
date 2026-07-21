export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
}

export interface CRMOverview {
  totalCustomers: number;
  activeCustomers: number;
  newCustomers: number;
}