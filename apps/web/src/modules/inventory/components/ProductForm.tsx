import {
  useState,
} from "react";

import {
  useProductMutation,
} from "../hooks/useProductMutation";


export default function ProductForm() {
  const { create } = useProductMutation();

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);


  function submit() {
    create.mutate({
  name,
  sku,
  type: "single",
  categoryId: "general",
  openingStock: quantity,
  costPrice: price,
  sellingPrice: price,
});

    setName("");
    setSku("");
    setQuantity(0);
    setPrice(0);
  }


  return (
    <div className="surface p-5 space-y-4">
      <h2 className="text-xl font-bold">
        Add Product
      </h2>

      <input
        className="w-full rounded border p-2"
        placeholder="Product name"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
      />

      <input
        className="w-full rounded border p-2"
        placeholder="SKU"
        value={sku}
        onChange={(e) =>
          setSku(e.target.value)
        }
      />

      <input
        className="w-full rounded border p-2"
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) =>
          setQuantity(Number(e.target.value))
        }
      />

      <input
        className="w-full rounded border p-2"
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) =>
          setPrice(Number(e.target.value))
        }
      />

      <button
        className="rounded bg-black px-4 py-2 text-white"
        onClick={submit}
      >
        Create Product
      </button>
    </div>
  );
}