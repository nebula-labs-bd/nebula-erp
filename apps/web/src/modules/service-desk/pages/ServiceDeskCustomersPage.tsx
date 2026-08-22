import { Users } from "lucide-react";

import ServiceDeskPlaceholderPage from "./ServiceDeskPlaceholderPage";

export default function ServiceDeskCustomersPage() {
  return (
    <ServiceDeskPlaceholderPage
      title="Customers"
      description="Service customers — linked to the existing CRM/Sales contacts (no duplication)."
      icon={Users}
    />
  );
}
