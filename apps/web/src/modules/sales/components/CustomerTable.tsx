import type { Customer } from "../types/sales.types";


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
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Phone</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((customer) => (
            <tr
              key={customer.id}
              className="border-b"
            >
              <td className="p-3">
                <div className="font-medium">
                  {customer.name}
                </div>
                {customer.taxNumber && (
                  <div className="text-sm opacity-60">
                    Tax: {customer.taxNumber}
                  </div>
                )}
              </td>

              <td className="p-3">{customer.phone}</td>

              <td className="p-3">{customer.email}</td>

              <td className="p-3">
                <span
                  className={
                    customer.status === "active"
                      ? "rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700"
                      : "rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600"
                  }
                >
                  {customer.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
