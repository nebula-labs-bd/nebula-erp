import type {
  ProductMaster,
} from "../types/product.types";


type ProductDetailsProps = {
  product: ProductMaster;
};


export default function ProductDetails({
  product,
}: ProductDetailsProps) {

  return (
    <div className="surface p-6 space-y-6">

      <div>
        <h2 className="text-2xl font-bold">
          {product.name}
        </h2>

        <p className="text-sm opacity-70">
          Product Master Details
        </p>
      </div>


      <section className="space-y-2">

        <h3 className="font-semibold">
          Basic Information
        </h3>

        <p>
          SKU: {product.sku}
        </p>

        <p>
          Barcode: {product.barcode || "—"}
        </p>

        <p>
          Type: {product.type}
        </p>

        <p>
          Category: {product.categoryId || "—"}
        </p>

        <p>
          Brand: {product.brandId || "—"}
        </p>

        <p>
          Unit: {product.unitId || "—"}
        </p>

      </section>



      <section className="space-y-2">

        <h3 className="font-semibold">
          Commerce Information
        </h3>

        <p>
          Short Description:
          <br />
          {product.shortDescription || "—"}
        </p>

        <p>
          Long Description:
          <br />
          {product.longDescription || "—"}
        </p>

        <p>
          Tags:
          {" "}
          {product.tags.length
            ? product.tags.join(", ")
            : "—"}
        </p>

      </section>



      <section className="space-y-2">

        <h3 className="font-semibold">
          Pricing
        </h3>

        <p>
          Cost Price:
          {" "}
          {product.costPrice}
        </p>

        <p>
          Selling Price:
          {" "}
          {product.sellingPrice}
        </p>

        <p>
          Wholesale Price:
          {" "}
          {product.wholesalePrice ?? "—"}
        </p>

      </section>



      <section className="space-y-2">

        <h3 className="font-semibold">
          Inventory
        </h3>

        <p>
          Opening Stock:
          {" "}
          {product.openingStock}
        </p>

        <p>
          Current Stock:
          {" "}
          {product.currentStock}
        </p>

        <p>
          Reorder Level:
          {" "}
          {product.reorderLevel ?? "—"}
        </p>

        <p>
          Batch Tracking:
          {" "}
          {product.batchTracking
            ? "Enabled"
            : "Disabled"}
        </p>

        <p>
          Serial Tracking:
          {" "}
          {product.serialTracking
            ? "Enabled"
            : "Disabled"}
        </p>

      </section>



      <section className="space-y-2">

        <h3 className="font-semibold">
          Warranty
        </h3>

        {product.warranty?.enabled ? (

          <>

            <p>
              Duration:
              {" "}
              {product.warranty.duration}
              {" "}
              {product.warranty.unit}
            </p>

            <p className="text-green-600">
              Active Warranty
            </p>

          </>

        ) : (

          <p>
            No Warranty
          </p>

        )}

      </section>



      <section className="space-y-2">

        <h3 className="font-semibold">
          Integration
        </h3>

        <p>
          WooCommerce ID:
          {" "}
          {product.integration?.wooCommerceId || "—"}
        </p>

        <p>
          Shopify ID:
          {" "}
          {product.integration?.shopifyId || "—"}
        </p>

        <p>
          Sync Status:
          {" "}
          {product.integration?.syncStatus || "—"}
        </p>

      </section>


    </div>
  );
}