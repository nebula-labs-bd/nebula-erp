import {
  useState,
} from "react";


export default function UnitConversionForm() {

  const [fromUnit, setFromUnit] =
    useState("");

  const [toUnit, setToUnit] =
    useState("");

  const [multiplier, setMultiplier] =
    useState(1);



  function submit() {

    console.log({
      fromUnit,
      toUnit,
      multiplier,
    });


    setFromUnit("");
    setToUnit("");
    setMultiplier(1);

  }



  return (

    <div className="surface p-5 space-y-4">


      <h2 className="text-xl font-bold">
        Add Unit Conversion
      </h2>



      <input

        className="w-full rounded border p-2"

        placeholder="From unit (Example: Roll)"

        value={fromUnit}

        onChange={
          e =>
            setFromUnit(
              e.target.value,
            )
        }

      />



      <input

        className="w-full rounded border p-2"

        placeholder="To unit (Example: Meter)"

        value={toUnit}

        onChange={
          e =>
            setToUnit(
              e.target.value,
            )
        }

      />



      <input

        className="w-full rounded border p-2"

        type="number"

        placeholder="Multiplier"

        value={multiplier}

        onChange={
          e =>
            setMultiplier(
              Number(
                e.target.value,
              ),
            )
        }

      />



      <button

        className="rounded bg-black px-4 py-2 text-white"

        onClick={submit}

      >

        Save Conversion

      </button>


    </div>

  );

}