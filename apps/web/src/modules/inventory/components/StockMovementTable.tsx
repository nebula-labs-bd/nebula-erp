import type {
  StockMovement,
} from "../types/inventory.types";


type Props = {
  movements: StockMovement[];
};


export default function StockMovementTable({
  movements,
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
              Type
            </th>

            <th className="p-3 text-left">
              Quantity
            </th>

            <th className="p-3 text-left">
              Date
            </th>

          </tr>
        </thead>


        <tbody>

          {movements.map((movement) => (

            <tr
              key={movement.id}
              className="border-b"
            >

              <td className="p-3">
                {movement.productName}
              </td>


              <td className="p-3">
                {movement.type}
              </td>


              <td className="p-3">
                {movement.quantity}
              </td>


              <td className="p-3">
                {movement.date}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}