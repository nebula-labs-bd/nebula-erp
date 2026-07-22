import type {
  ProductMaster,
} from "../types/product.types";


type ProductTableProps = {
  products: ProductMaster[];
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
              Barcode
            </th>

            <th className="p-3 text-left">
              Stock
            </th>

            <th className="p-3 text-left">
              Price
            </th>

            <th className="p-3 text-left">
              Warranty
            </th>

            <th className="p-3 text-left">
              Sync
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

                <div className="font-medium">
                  {product.name}
                </div>

                <div className="text-sm opacity-60">
                  {product.type}
                </div>

              </td>


              <td className="p-3">
                {product.sku}
              </td>


              <td className="p-3">
                {product.barcode || "—"}
              </td>


              <td className="p-3">

                {product.currentStock}

              </td>


              <td className="p-3">

                {product.sellingPrice}

              </td>


              <td className="p-3">

                {product.warranty?.enabled
                  ? `${product.warranty.duration} ${product.warranty.unit}`
                  : "No Warranty"}

              </td>


              <td className="p-3">

                {product.integration?.syncStatus ?? "—"}

              </td>


            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}