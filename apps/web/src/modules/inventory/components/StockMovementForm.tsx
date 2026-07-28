import {
  useMemo,
  useState,
} from "react";

import {
  useStockMovement,
} from "../hooks/useStockMovement";

import {
  useProducts,
} from "../hooks/useProducts";

import {
  useWarehouses,
} from "../hooks/useWarehouse";

import {
  useUnits,
} from "../hooks/useUnits";

import {
  useUnitConversions,
} from "../hooks/useUnitConversions";

import {
  convertBetweenUnits,
} from "../utils/unitConversion";


export default function StockMovementForm() {

  const mutation =
    useStockMovement();


  const {
    data: products = [],
  } =
    useProducts();


  const {
    data: warehouses = [],
  } =
    useWarehouses();


  const {
    data: units = [],
  } =
    useUnits();


  const {
    data: conversions = [],
  } =
    useUnitConversions();



  const [
    productId,
    setProductId,
  ] =
    useState("");


  const [
    warehouseId,
    setWarehouseId,
  ] =
    useState("");


  const [
    unitId,
    setUnitId,
  ] =
    useState("");


  const [
    quantity,
    setQuantity,
  ] =
    useState(0);


  const [
    referenceId,
    setReferenceId,
  ] =
    useState("");



  const [
    type,
    setType,
  ] =
    useState<
      "stock-in" |
      "stock-out" |
      "adjustment"
    >("stock-in");



  const selectedProduct =
    products.find(
      (product) =>
        product.id === productId,
    );



  const baseQuantity =
    useMemo(() => {

      if (
        !selectedProduct ||
        !unitId ||
        !selectedProduct.unitId
      ) {
        return quantity;
      }


      const result =
        convertBetweenUnits(
          quantity,
          unitId,
          selectedProduct.unitId,
          conversions,
        );


      return result ?? quantity;


    }, [
      quantity,
      unitId,
      selectedProduct,
      conversions,
    ]);




  function submit() {

    mutation.mutate({

      productId,

      warehouseId,

      quantity,

      unitId,

      baseQuantity,

      type,

      referenceType:
        "adjustment",

      referenceId:
        referenceId,

      transactionDate:
        new Date().toISOString(),

      note:
        "Manual stock update",

    });

  }



  return (

    <div className="surface p-5 space-y-4">


      <h2 className="text-xl font-bold">
        Stock Movement
      </h2>



      <select
        className="w-full rounded border p-2"
        value={productId}
        onChange={(e) =>
          setProductId(
            e.target.value,
          )
        }
      >

        <option value="">
          Select Product
        </option>


        {products.map(
          (product) => (

            <option
              key={product.id}
              value={product.id}
            >
              {product.name}
            </option>

          ),
        )}

      </select>



      <select
        className="w-full rounded border p-2"
        value={warehouseId}
        onChange={(e) =>
          setWarehouseId(
            e.target.value,
          )
        }
      >

        <option value="">
          Select Warehouse
        </option>


        {warehouses.map(
          (warehouse) => (

            <option
              key={warehouse.id}
              value={warehouse.id}
            >
              {warehouse.name}
            </option>

          ),
        )}

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



      <select
        className="w-full rounded border p-2"
        value={unitId}
        onChange={(e) =>
          setUnitId(
            e.target.value,
          )
        }
      >

        <option value="">
          Select Unit
        </option>


        {units.map(
          (unit) => (

            <option
              key={unit.id}
              value={unit.id}
            >
              {unit.name}
            </option>

          ),
        )}

      </select>



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


      <label className="block space-y-1">
        <span className="text-sm">
          Reference ID
        </span>

        <input
          className="w-full rounded border p-2"
          type="text"
          placeholder="PO-001, INV-001, or ADJ-001"
          value={referenceId}
          onChange={(e) =>
            setReferenceId(
              e.target.value,
            )
          }
        />
      </label>



      <div className="rounded border p-3 text-sm">

        Base Quantity:

        {" "}

        {baseQuantity}

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
