import type {
  Unit,
} from "../types/unit.types";


type UnitTableProps = {
  units: Unit[];
};


export default function UnitTable({
  units,
}: UnitTableProps) {

  return (

    <div className="surface overflow-hidden">

      <table className="w-full">

        <thead>

          <tr className="border-b">

            <th className="p-3 text-left">
              Unit
            </th>

            <th className="p-3 text-left">
              Short Name
            </th>

            <th className="p-3 text-left">
              Base Unit
            </th>

            <th className="p-3 text-left">
              Status
            </th>

          </tr>

        </thead>


        <tbody>

          {
            units.map((unit) => (

              <tr
                key={unit.id}
                className="border-b"
              >

                <td className="p-3">
                  {unit.name}
                </td>


                <td className="p-3">
                  {unit.shortName}
                </td>


                <td className="p-3">

                  {
                    unit.isBaseUnit
                      ? "Yes"
                      : "No"
                  }

                </td>


                <td className="p-3">

                  {unit.status}

                </td>


              </tr>

            ))
          }

        </tbody>


      </table>

    </div>

  );
}