import type { Contact, ContactRole } from "../types/contact.types";

type ContactTableProps = {
  contacts: Contact[];
  selectedContactId?: string;
  onSelect?: (contact: Contact) => void;
};

function statusClass(status: Contact["status"]): string {
  return status === "active"
    ? "rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700"
    : "rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700";
}

function roleBadge(role: ContactRole): string {
  const base = "rounded px-2 py-1 text-xs font-medium mr-1";
  return role === "customer"
    ? `${base} bg-blue-100 text-blue-700`
    : `${base} bg-purple-100 text-purple-700`;
}

export default function ContactTable({
  contacts,
  selectedContactId,
  onSelect,
}: ContactTableProps) {
  return (
    <div className="surface overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Company</th>
            <th className="p-3 text-left">Roles</th>
            <th className="p-3 text-left">Phone</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {contacts.map((contact) => (
            <tr
              key={contact.id}
              className={`border-b cursor-pointer transition-colors ${
                selectedContactId === contact.id
                  ? "bg-[var(--nebula-primary)]/10"
                  : "hover:bg-[var(--nebula-surface-muted)]"
              }`}
              onClick={() => onSelect?.(contact)}
            >
              <td className="p-3 font-medium">{contact.name}</td>

              <td className="p-3">{contact.companyName || "-"}</td>

              <td className="p-3">
                {contact.roles.map((role) => (
                  <span key={role} className={roleBadge(role)}>
                    {role}
                  </span>
                ))}
              </td>

              <td className="p-3">{contact.phone || "-"}</td>

              <td className="p-3">{contact.email || "-"}</td>

              <td className="p-3">
                <span className={statusClass(contact.status)}>
                  {contact.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}