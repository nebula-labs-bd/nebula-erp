import {
  useState,
} from "react";

import {
  useWarehouseMutation,
} from "../hooks/useWarehouse";


export default function WarehouseForm() {
  const mutation = useWarehouseMutation();

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [location, setLocation] = useState("");


  function submit() {
    mutation.mutate({
      name,
      code,
      location,
    });

    setName("");
    setCode("");
    setLocation("");
  }


  return (
    <div className="surface p-5 space-y-4">

      <h2 className="text-xl font-bold">
        Add Warehouse
      </h2>


      <input
        className="w-full rounded border p-2"
        placeholder="Warehouse name"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
      />


      <input
        className="w-full rounded border p-2"
        placeholder="Code"
        value={code}
        onChange={(e) =>
          setCode(e.target.value)
        }
      />


      <input
        className="w-full rounded border p-2"
        placeholder="Location"
        value={location}
        onChange={(e) =>
          setLocation(e.target.value)
        }
      />


      <button
        className="rounded bg-black px-4 py-2 text-white"
        onClick={submit}
      >
        Create Warehouse
      </button>

    </div>
  );
}