import CustomerTable from "../components/CustomerTable";

import type {
  Customer,
} from "../types/crm.types";


const demoCustomers: Customer[] = [
  {
    id: "1",
    name: "Rahim Ahmed",
    company: "Nebula Trading",
    email: "rahim@example.com",
    phone: "+8801700000000",
    status: "active",
  },
  {
    id: "2",
    name: "Karim Hasan",
    company: "Future Solutions",
    email: "karim@example.com",
    phone: "+8801800000000",
    status: "inactive",
  },
];


export default function CRMPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          CRM Module
        </h1>

        <p className="mt-2 text-[var(--nebula-text-secondary)]">
          Manage customers and relationships.
        </p>
      </div>

      <CustomerTable
        customers={demoCustomers}
      />
    </div>
  );
}