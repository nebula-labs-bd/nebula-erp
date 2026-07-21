import type {
  Customer,
} from "../types/crm.types";


type CustomerTableProps = {
  customers: Customer[];
};


export default function CustomerTable({
  customers,
}: CustomerTableProps) {
  return (
    <div className="surface overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">
              Customer
            </th>

            <th className="p-3 text-left">
              Company
            </th>

            <th className="p-3 text-left">
              Email
            </th>

            <th className="p-3 text-left">
              Status
            </th>
          </tr>
        </thead>

        <tbody>
          {customers.map((customer) => (
            <tr
              key={customer.id}
              className="border-b"
            >
              <td className="p-3">
                {customer.name}
              </td>

              <td className="p-3">
                {customer.company}
              </td>

              <td className="p-3">
                {customer.email}
              </td>

              <td className="p-3">
                {customer.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}