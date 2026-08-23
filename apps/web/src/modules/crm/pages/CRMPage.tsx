import CustomerTable from "../components/CustomerTable";

import { useContacts } from "../../contacts/hooks/useContacts";


export default function CRMPage() {
  const { data: contacts = [], isLoading } = useContacts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          CRM Module
        </h1>

        <p className="mt-2 text-[var(--nebula-text-secondary)]">
          Manage customers and relationships via the unified Contact Registry.
        </p>
      </div>

      {isLoading ? (
        <div className="surface p-6 text-sm text-[var(--nebula-text-muted)]">
          Loading contacts…
        </div>
      ) : (
        <CustomerTable contacts={contacts} />
      )}
    </div>
  );
}