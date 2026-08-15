import { useState } from "react";

import ContactForm from "../components/ContactForm";
import ContactTable from "../components/ContactTable";
import ContactLedgerTable from "../components/ContactLedgerTable";
import ContactBalance from "../components/ContactBalance";

import { useContacts } from "../hooks/useContacts";
import { useContactLedger } from "../hooks/useContacts";

import type { Contact } from "../types/contact.types";

export default function ContactsPage() {
  const { data: contacts = [] } = useContacts();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: ledgerEntries = [] } = useContactLedger(
    selectedContact?.id || "",
  );

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold">Contacts</h1>

        <p className="mt-2 text-[var(--nebula-text-secondary)]">
          Unified contact management. A contact can act as Customer, Supplier,
          or both. All financial activity is traceable through the contact
          ledger.
        </p>
      </div>

      {/* Contact Management */}
      <section id="contacts-management" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Contact Management</h2>

          <button
            className="rounded bg-black px-4 py-2 text-white"
            onClick={() => setShowForm(true)}
          >
            Add Contact
          </button>
        </div>

        <ContactTable
          contacts={contacts}
          selectedContactId={selectedContact?.id}
          onSelect={setSelectedContact}
        />
      </section>

      {/* Contact Ledger */}
      <section id="contacts-ledger" className="space-y-4">
        <h2 className="text-xl font-semibold">
          Contact Ledger
          {selectedContact && (
            <span className="ml-3 text-sm font-normal text-[var(--nebula-text-secondary)]">
              {selectedContact.name} ({selectedContact.roles.join(", ")})
            </span>
          )}
        </h2>

        {selectedContact && <ContactBalance contact={selectedContact} />}

        {!selectedContact ? (
          <div className="surface p-8 text-center text-[var(--nebula-text-secondary)]">
            Select a contact from the table above to view their financial ledger.
          </div>
        ) : (
          <div className="surface overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <span className="font-medium">
                {ledgerEntries.length} entries
              </span>
            </div>

            {ledgerEntries.length === 0 ? (
              <div className="p-8 text-center text-[var(--nebula-text-secondary)]">
                No financial activity for this contact yet.
              </div>
            ) : (
              <ContactLedgerTable entries={ledgerEntries} />
            )}
          </div>
        )}
      </section>

      {/* Modal: Contact Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <ContactForm onClose={() => setShowForm(false)} />
        </div>
      )}
    </div>
  );
}