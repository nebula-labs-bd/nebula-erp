import {
  useMemo,
  useState,
} from "react";

import {
  useCreateStockAdjustment,
} from "../hooks/useStockAdjustment";

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

import type {
  StockAdjustmentType,
} from "../types/inventory.types";


export default function StockAdjustmentForm() {
  const mutation =
    useCreateStockAdjustment();


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
    type,
    setType,
  ] =
    useState<StockAdjustmentType>(
      "increase",
    );


  const [
    reason,
    setReason,
  ] =
    useState("");


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



  function submit() {
    mutation.mutate({
      productId,

      warehouseId,

      unitId,

      quantity,

      baseQuantity,

      type,

      reason,

      note,
    });


    setProductId("");
    setWarehouseId("");
    setUnitId("");
    setQuantity(0);
    setType("increase");
    setReason("");
    setNote("");
  }



  return (

    <div className="surface p-5 space-y-4">

      <h2 className="text-xl font-bold">
        Stock Adjustment
      </h2>


      <p className="text-sm text-[var(--nebula-text-secondary)]">
        Correct inventory quantities. Each adjustment
        automatically creates a Stock Movement
        (stock-in / stock-out) that flows into the
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



      <select
        className="w-full rounded border p-2"
        value={type}
        onChange={(e) =>
          setType(
            e.target.value as
              StockAdjustmentType,
          )
        }
      >

        <option value="increase">
          Increase
        </option>

        <option value="decrease">
          Decrease
        </option>

      </select>



      <input
        className="w-full rounded border p-2"
        type="text"
        placeholder="Reason (e.g. Physical count mismatch, Damaged, Lost, Opening stock)"
        value={reason}
        onChange={(e) =>
          setReason(
            e.target.value,
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
        onClick={submit}
      >
        Create Adjustment
      </button>

    </div>

  );
}
