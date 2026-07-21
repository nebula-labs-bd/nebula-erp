export interface SalesOrder {
  id: string;
  customer: string;
  date: string;
  status: "pending" | "completed" | "cancelled";
  total: number;
}

export interface SalesSummary {
  totalOrders: number;
  revenue: number;
  pendingOrders: number;
}