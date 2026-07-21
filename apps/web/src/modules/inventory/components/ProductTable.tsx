import type { Product } from "../types/inventory.types";


type ProductTableProps = {
  products: Product[];
};


export default function ProductTable({
  products,
}: ProductTableProps) {
  return (
    <div className="surface overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">
              Product
            </th>

            <th className="p-3 text-left">
              SKU
            </th>

            <th className="p-3 text-left">
              Stock
            </th>

            <th className="p-3 text-left">
              Price
            </th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-b"
            >
              <td className="p-3">
                {product.name}
              </td>

              <td className="p-3">
                {product.sku}
              </td>

              <td className="p-3">
                {product.quantity}
              </td>

              <td className="p-3">
                ${product.price}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}