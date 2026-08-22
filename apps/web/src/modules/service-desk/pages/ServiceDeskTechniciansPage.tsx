import { Wrench } from "lucide-react";

import ServiceDeskPlaceholderPage from "./ServiceDeskPlaceholderPage";

export default function ServiceDeskTechniciansPage() {
  return (
    <ServiceDeskPlaceholderPage
      title="Technicians"
      description="Field technicians and their specialities for dispatch."
      icon={Wrench}
    />
  );
}
