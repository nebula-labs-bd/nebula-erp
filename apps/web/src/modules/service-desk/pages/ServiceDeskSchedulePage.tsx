import { CalendarDays } from "lucide-react";

import ServiceDeskPlaceholderPage from "./ServiceDeskPlaceholderPage";

export default function ServiceDeskSchedulePage() {
  return (
    <ServiceDeskPlaceholderPage
      title="Schedule"
      description="Dispatch board and technician calendar."
      icon={CalendarDays}
    />
  );
}
