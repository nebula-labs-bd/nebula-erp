import type {
  Warehouse,
} from "../types/inventory.types";


type Props = {
  warehouses: Warehouse[];
};


export default function WarehouseTable({
  warehouses,
}: Props) {
  return (
    <div className="surface overflow-hidden">

      <table className="w-full">

        <thead>
          <tr className="border-b">

            <th className="p-3 text-left">
              Name
            </th>

            <th className="p-3 text-left">
              Code
            </th>

            <th className="p-3 text-left">
              Location
            </th>

            <th className="p-3 text-left">
              Status
            </th>

          </tr>
        </thead>


        <tbody>

          {warehouses.map((warehouse) => (

            <tr
              key={warehouse.id}
              className="border-b"
            >

              <td className="p-3">
                {warehouse.name}
              </td>

              <td className="p-3">
                {warehouse.code}
              </td>

              <td className="p-3">
                {warehouse.location}
              </td>

              <td className="p-3">
                {warehouse.status}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}