import type {
  UnitConversion,
} from "../types/unit.types";


type UnitConversionTableProps = {
  conversions: UnitConversion[];
};


export default function UnitConversionTable({
  conversions,
}: UnitConversionTableProps) {


  return (

    <div className="surface overflow-hidden">


      <table className="w-full">


        <thead>

          <tr className="border-b">


            <th className="p-3 text-left">
              From Unit
            </th>


            <th className="p-3 text-left">
              To Unit
            </th>


            <th className="p-3 text-left">
              Multiplier
            </th>


          </tr>

        </thead>



        <tbody>

          {
            conversions.map(
              (conversion) => (

                <tr
                  key={conversion.id}
                  className="border-b"
                >

                  <td className="p-3">
                    {conversion.fromUnitId}
                  </td>


                  <td className="p-3">
                    {conversion.toUnitId}
                  </td>


                  <td className="p-3">
                    1 = {conversion.multiplier}
                  </td>


                </tr>

              )
            )
          }


        </tbody>


      </table>


    </div>

  );

}