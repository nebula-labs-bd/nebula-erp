import {
  useState,
} from "react";

import {
  useUnits,
} from "../hooks/useUnits";


export default function UnitForm() {

  const {
    data: units = [],
  } = useUnits();


  const [name, setName] =
    useState("");

  const [shortName, setShortName] =
    useState("");

  const [isBaseUnit, setIsBaseUnit] =
    useState(false);



  function submit() {

    console.log({
      name,
      shortName,
      isBaseUnit,
      units,
    });

    setName("");
    setShortName("");
    setIsBaseUnit(false);

  }



  return (

    <div className="surface p-5 space-y-4">

      <h2 className="text-xl font-bold">
        Add Unit
      </h2>


      <input

        className="w-full rounded border p-2"

        placeholder="Unit name"

        value={name}

        onChange={
          e =>
            setName(e.target.value)
        }

      />


      <input

        className="w-full rounded border p-2"

        placeholder="Short name"

        value={shortName}

        onChange={
          e =>
            setShortName(e.target.value)
        }

      />


      <label className="flex gap-2">

        <input

          type="checkbox"

          checked={isBaseUnit}

          onChange={
            e =>
              setIsBaseUnit(
                e.target.checked,
              )
          }

        />

        Base Unit

      </label>


      <button

        className="rounded bg-black px-4 py-2 text-white"

        onClick={submit}

      >

        Create Unit

      </button>


    </div>

  );
}