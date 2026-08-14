import {
  useMemo,
  useState,
} from "react";

import {
  useCreateStockTransfer,
} from "../hooks/useStockTransfer";

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


export default function StockTransferForm() {
  const mutation =
    useCreateStockTransfer();


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
    fromWarehouseId,
    setFromWarehouseId,
  ] =
    useState("");


  const [
    toWarehouseId,
    setToWarehouseId,
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
    note,
    setNote,
  ] =
    useState("");


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


  const sameWarehouse =
    fromWarehouseId !== "" &&
    toWarehouseId !== "" &&
    fromWarehouseId === toWarehouseId;


  function submit() {

    if (sameWarehouse) {
      return;
    }


    mutation.mutate({
      productId,

      fromWarehouseId,

      toWarehouseId,

      unitId,

      quantity,

      baseQuantity,

      note,
    });


    setProductId("");
    setFromWarehouseId("");
    setToWarehouseId("");
    setUnitId("");
    setQuantity(0);
    setNote("");
  }


  return (

    <div className="surface p-5 space-y-4">

      <h2 className="text-xl font-bold">
        Stock Transfer
      </h2>


      <p className="text-sm text-[var(--nebula-text-secondary)]">
        Move stock between warehouses. Each transfer
        automatically creates a Stock Movement OUT
        (source warehouse) and a Stock Movement IN
        (destination warehouse) that flow into the
        ledger. Product stock is never updated directly.
      </p>


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
        value={fromWarehouseId}
        onChange={(e) =>
          setFromWarehouseId(
            e.target.value,
          )
        }
      >

        <option value="">
          Select Source Warehouse
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



      <select
        className="w-full rounded border p-2"
        value={toWarehouseId}
        onChange={(e) =>
          setToWarehouseId(
            e.target.value,
          )
        }
      >

        <option value="">
          Select Destination Warehouse
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

      {sameWarehouse && (
        <p className="text-sm text-red-600">
          Source and destination warehouse
          cannot be the same.
        </p>
      )}



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
              {" "}
              ({unit.shortName})
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



      <label className="block space-y-1">
        <span className="text-sm">
          Note
        </span>

        <textarea
          className="w-full rounded border p-2"
          placeholder="Optional notes"
          value={note}
          onChange={(e) =>
            setNote(
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
        disabled={sameWarehouse}
        onClick={submit}
      >
        Create Transfer
      </button>

    </div>

  );
}
