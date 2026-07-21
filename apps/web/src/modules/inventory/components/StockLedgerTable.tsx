import type {
  StockLedgerEntry,
} from "../types/inventory.types";


type Props = {
  entries: StockLedgerEntry[];
};


export default function StockLedgerTable({
  entries,
}: Props) {
  return (
    <div className="surface overflow-hidden">

      <table className="w-full">

        <thead>
          <tr className="border-b">

            <th className="p-3 text-left">
              Product
            </th>

            <th className="p-3 text-left">
              Warehouse
            </th>

            <th className="p-3 text-left">
              Type
            </th>

            <th className="p-3 text-left">
              Balance
            </th>

          </tr>
        </thead>


        <tbody>

          {entries.map((entry) => (

            <tr
              key={entry.id}
              className="border-b"
            >

              <td className="p-3">
                {entry.productName}
              </td>

              <td className="p-3">
                {entry.warehouse}
              </td>

              <td className="p-3">
                {entry.type}
              </td>

              <td className="p-3">
                {entry.balance}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}