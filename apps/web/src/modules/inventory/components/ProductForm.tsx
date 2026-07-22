
import { useEffect, useState } from "react";

import {
  useUnits,
} from "../hooks/useUnits";

import type {
  ProductMaster,
  ProductType,
} from "../types/product.types";

import {
  useProductMutation,
} from "../hooks/useProductMutation";


type ProductFormProps = {
  product?: ProductMaster;
  onCancel?: () => void;
};


type ProductFormState = {
  name: string;
  sku: string;
  barcode: string;

  type: ProductType;

  categoryId: string;
  brandId: string;
  unitId: string;

  shortDescription: string;
  longDescription: string;

  tags: string[];

  costPrice: number;
  sellingPrice: number;
  wholesalePrice: number;

  openingStock: number;
  reorderLevel: number;

  batchTracking: boolean;
  serialTracking: boolean;

  warrantyEnabled: boolean;
  warrantyDuration: number;
  warrantyUnit: "days" | "months" | "years";

  wooCommerceId: string;
  shopifyId: string;
};


const initialState: ProductFormState = {
  name: "",
  sku: "",
  barcode: "",

  type: "single",

  categoryId: "",
  brandId: "",
  unitId: "",

  shortDescription: "",
  longDescription: "",

  tags: [],

  costPrice: 0,
  sellingPrice: 0,
  wholesalePrice: 0,

  openingStock: 0,
  reorderLevel: 0,

  batchTracking: false,
  serialTracking: false,

  warrantyEnabled: false,
  warrantyDuration: 0,
  warrantyUnit: "years",

  wooCommerceId: "",
  shopifyId: "",
};


export default function ProductForm({
  product,
  onCancel,
}: ProductFormProps) {

  const {
    create,
    update,
  } = useProductMutation();

  const {
  data: units = [],
} = useUnits();

  const [form, setForm] =
    useState<ProductFormState>(initialState);


  const editMode = Boolean(product);


  useEffect(() => {

    if (!product) {
      setForm(initialState);
      return;
    }


    setForm({
      name: product.name,
      sku: product.sku,
      barcode: product.barcode ?? "",

      type: product.type,

      categoryId: product.categoryId ?? "",
      brandId: product.brandId ?? "",
      unitId: product.unitId ?? "",

      shortDescription:
        product.shortDescription ?? "",

      longDescription:
        product.longDescription ?? "",

      tags: product.tags ?? [],

      costPrice:
        product.costPrice,

      sellingPrice:
        product.sellingPrice,

      wholesalePrice:
        product.wholesalePrice ?? 0,


      openingStock:
        product.openingStock,

      reorderLevel:
        product.reorderLevel ?? 0,


      batchTracking:
        product.batchTracking,

      serialTracking:
        product.serialTracking,


      warrantyEnabled:
        product.warranty?.enabled ?? false,

      warrantyDuration:
        product.warranty?.duration ?? 0,

      warrantyUnit:
        product.warranty?.unit ?? "years",


      wooCommerceId:
        product.integration?.wooCommerceId ?? "",

      shopifyId:
        product.integration?.shopifyId ?? "",
    });

  }, [product]);



  function updateField<K extends keyof ProductFormState>(
    key: K,
    value: ProductFormState[K],
  ) {
    setForm(prev => ({
      ...prev,
      [key]: value,
    }));
  }



  function submit() {

    const payload = {

      name: form.name,

      sku: form.sku,

      barcode: form.barcode,

      type: form.type,


      categoryId:
        form.categoryId || undefined,

      brandId:
        form.brandId || undefined,

      unitId:
        form.unitId || undefined,


      shortDescription:
        form.shortDescription,

      longDescription:
        form.longDescription,


      tags:
        form.tags,


      costPrice:
        form.costPrice,

      sellingPrice:
        form.sellingPrice,

      wholesalePrice:
        form.wholesalePrice,


      openingStock:
  form.openingStock,

currentStock:
  product?.currentStock ?? form.openingStock,

reorderLevel:
  form.reorderLevel,


      warehouseIds: [],


      batchTracking:
        form.batchTracking,

      serialTracking:
        form.serialTracking,


      warranty: {

        enabled:
          form.warrantyEnabled,

        duration:
          form.warrantyDuration,

        unit:
          form.warrantyUnit,

      },


      integration: {

  wooCommerceId:
    form.wooCommerceId || undefined,

  shopifyId:
    form.shopifyId || undefined,

  syncStatus:
    "not-synced" as const,

},


      attributes: [],

      variants: [],

      images: [],

    };


    if (editMode && product) {

      update.mutate({
        ...payload,
        id: product.id,
        createdAt: product.createdAt,
        updatedAt: new Date().toISOString(),
      });

    } else {

      create.mutate(payload);

      setForm(initialState);

    }

  }



  return (

    <div className="surface p-6 space-y-6">


      <h2 className="text-xl font-bold">

        {editMode
          ? "Edit Product"
          : "Add Product"}

      </h2>



      <section className="space-y-3">

        <h3 className="font-semibold">
          Basic Information
        </h3>


        <input
          className="w-full rounded border p-2"
          placeholder="Product name"
          value={form.name}
          onChange={
            e =>
              updateField(
                "name",
                e.target.value,
              )
          }
        />


        <input
          className="w-full rounded border p-2"
          placeholder="SKU"
          value={form.sku}
          onChange={
            e =>
              updateField(
                "sku",
                e.target.value,
              )
          }
        />


        <input
          className="w-full rounded border p-2"
          placeholder="Barcode"
          value={form.barcode}
          onChange={
            e =>
              updateField(
                "barcode",
                e.target.value,
              )
          }
        />

      </section>

      <select
  className="w-full rounded border p-2"
  value={form.unitId}
  onChange={
    e =>
      updateField(
        "unitId",
        e.target.value,
      )
  }
>

  <option value="">
    Select Unit
  </option>


  {units.map((unit) => (

    <option
      key={unit.id}
      value={unit.id}
    >

      {unit.name}
      {" "}
      ({unit.shortName})

    </option>

  ))}


</select>

      <section className="space-y-3">

        <h3 className="font-semibold">
          Commerce Information
        </h3>


        <input
          className="w-full rounded border p-2"
          placeholder="Short description"
          value={form.shortDescription}
          onChange={
            e =>
              updateField(
                "shortDescription",
                e.target.value,
              )
          }
        />


        <textarea
          className="w-full rounded border p-2"
          placeholder="Long description"
          value={form.longDescription}
          onChange={
            e =>
              updateField(
                "longDescription",
                e.target.value,
              )
          }
        />

      </section>



      <section className="space-y-3">

        <h3 className="font-semibold">
          Pricing
        </h3>


        <input
          className="w-full rounded border p-2"
          type="number"
          placeholder="Selling price"
          value={form.sellingPrice}
          onChange={
            e =>
              updateField(
                "sellingPrice",
                Number(e.target.value),
              )
          }
        />


      </section>



      <section className="space-y-3">

        <h3 className="font-semibold">
          Inventory
        </h3>


        <input
          className="w-full rounded border p-2"
          type="number"
          placeholder="Opening stock"
          value={form.openingStock}
          onChange={
            e =>
              updateField(
                "openingStock",
                Number(e.target.value),
              )
          }
        />

      </section>



      <section className="space-y-3">

        <h3 className="font-semibold">
          Warranty
        </h3>


        <label className="flex gap-2">

          <input
            type="checkbox"
            checked={form.warrantyEnabled}
            onChange={
              e =>
                updateField(
                  "warrantyEnabled",
                  e.target.checked,
                )
            }
          />

          Enable Warranty

        </label>


      </section>



      <div className="flex gap-3">

        <button
          className="rounded bg-black px-4 py-2 text-white"
          onClick={submit}
        >

          {editMode
            ? "Update Product"
            : "Create Product"}

        </button>


        {onCancel && (

          <button
            className="rounded border px-4 py-2"
            onClick={onCancel}
          >
            Cancel
          </button>

        )}

      </div>


    </div>

  );
}