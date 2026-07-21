import type {
  Product,
} from "../types/inventory.types";


type ProductDetailsProps = {
  product: Product;
};


export default function ProductDetails({
  product,
}: ProductDetailsProps) {
  return (
    <div className="surface p-5">
      <h2 className="text-xl font-bold">
        {product.name}
      </h2>

      <p className="mt-2">
        SKU: {product.sku}
      </p>

      <p>
        Stock: {product.quantity}
      </p>

      <p>
        Price: ${product.price}
      </p>

      <p>
        Status: {product.status}
      </p>
    </div>
  );
}