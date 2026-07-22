import {
  useState,
} from "react";

import {
  useStockMovement,
} from "../hooks/useStockMovement";


export default function StockMovementForm() {

  const mutation = useStockMovement();


  const [productId, setProductId] =
    useState("");

  const [quantity, setQuantity] =
    useState(0);

  const [unitId, setUnitId] =
    useState("meter");

  const [type, setType] =
    useState<
      "stock-in" | "stock-out" | "adjustment"
    >("stock-in");



  function submit() {

    mutation.mutate({

      productId,

      quantity,

      unitId,

      // Temporary:
      // 1 base unit = entered quantity
      // Real conversion engine will replace this

      baseQuantity: quantity,

      type,

      note: "Manual stock update",

    });

  }



  return (

    <div className="surface p-5 space-y-4">


      <h2 className="text-xl font-bold">
        Stock Movement
      </h2>



      <input

        className="w-full rounded border p-2"

        placeholder="Product ID"

        value={productId}

        onChange={(e) =>
          setProductId(
            e.target.value,
          )
        }

      />



      <select

        className="w-full rounded border p-2"

        value={type}

        onChange={(e) =>
          setType(
            e.target.value as
            | "stock-in"
            | "stock-out"
            | "adjustment",
          )
        }

      >

        <option value="stock-in">
          Stock In
        </option>


        <option value="stock-out">
          Stock Out
        </option>


        <option value="adjustment">
          Adjustment
        </option>


      </select>



      <input

        className="w-full rounded border p-2"

        type="number"

        placeholder="Quantity"

        value={quantity}

        onChange={(e) =>
          setQuantity(
            Number(
              e.target.value,
            ),
          )
        }

      />



      <input

        className="w-full rounded border p-2"

        placeholder="Unit ID"

        value={unitId}

        onChange={(e) =>
          setUnitId(
            e.target.value,
          )
        }

      />



      <div className="text-sm">

        Base Quantity:

        {" "}

        {quantity}

      </div>



      <button

        className="rounded bg-black px-4 py-2 text-white"

        onClick={submit}

      >

        Update Stock

      </button>


    </div>

  );

}