import type { Contact, ContactRole } from "../../contacts/types/contact.types";

const ROLE_LABELS: Record<ContactRole, string> = {
  customer: "Customer",
  vendor: "Vendor",
  partner: "Partner",
  other: "Other",
};


type CustomerTableProps = {
  contacts: Contact[];
};


export default function CustomerTable({
  contacts,
}: CustomerTableProps) {
  return (
    <div className="surface overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">
              Name
            </th>

            <th className="p-3 text-left">
              Company
            </th>

            <th className="p-3 text-left">
              Email
            </th>

            <th className="p-3 text-left">
              Roles
            </th>

            <th className="p-3 text-left">
              Status
            </th>
          </tr>
        </thead>

        <tbody>
          {contacts.map((contact) => (
            <tr
              key={contact.id}
              className="border-b"
            >
              <td className="p-3 font-medium">
                {contact.name}
              </td>

              <td className="p-3">
                {contact.companyName ?? "-"}
              </td>

              <td className="p-3">
                {contact.email ?? "-"}
              </td>

              <td className="p-3">
                {contact.roles
                  .map((role) => ROLE_LABELS[role] ?? role)
                  .join(", ") || "-"}
              </td>

              <td className="p-3">
                {contact.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}