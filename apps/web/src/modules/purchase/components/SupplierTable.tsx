import type { Supplier } from "../types/purchase.types";


type SupplierTableProps = {
  suppliers: Supplier[];
};


export default function SupplierTable({
  suppliers,
}: SupplierTableProps) {
  return (
    <div className="surface overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Company</th>
            <th className="p-3 text-left">Contact</th>
            <th className="p-3 text-left">Phone</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {suppliers.map((supplier) => (
            <tr
              key={supplier.id}
              className="border-b"
            >
              <td className="p-3">
                <div className="font-medium">
                  {supplier.companyName}
                </div>
                {supplier.taxNumber && (
                  <div className="text-sm opacity-60">
                    Tax: {supplier.taxNumber}
                  </div>
                )}
              </td>

              <td className="p-3">
                {supplier.contactPerson}
              </td>

              <td className="p-3">{supplier.phone}</td>

              <td className="p-3">{supplier.email}</td>

              <td className="p-3">
                <span
                  className={
                    supplier.status === "active"
                      ? "rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700"
                      : "rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600"
                  }
                >
                  {supplier.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
