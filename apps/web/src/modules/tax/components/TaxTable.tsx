import type { TaxType } from "../types/tax.types";

type TaxTableProps = {
  taxes: TaxType[];
};

export default function TaxTable({ taxes }: TaxTableProps) {
  return (
    <div className="surface overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Rate</th>
            <th className="p-3 text-left">Description</th>
            <th className="p-3 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {taxes.map((tax) => (
            <tr key={tax.id} className="border-b">
              <td className="p-3 font-medium">{tax.name}</td>

              <td className="p-3">{tax.rate}%</td>

              <td className="p-3">{tax.description}</td>

              <td className="p-3">
                <span
                  className={
                    tax.status === "active"
                      ? "rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700"
                      : "rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600"
                  }
                >
                  {tax.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
