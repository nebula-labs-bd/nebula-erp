import SupplierForm from "../components/SupplierForm";
import SupplierTable from "../components/SupplierTable";
import PurchaseOrderForm from "../components/PurchaseOrderForm";
import PurchaseOrderTable from "../components/PurchaseOrderTable";
import GoodsReceiveForm from "../components/GoodsReceiveForm";
import GoodsReceiveTable from "../components/GoodsReceiveTable";

import {
  useSuppliers,
} from "../hooks/useSupplier";

import {
  usePurchaseOrders,
} from "../hooks/usePurchaseOrder";

import {
  useGoodsReceives,
} from "../hooks/useGoodsReceive";


export default function PurchasePage() {
  const { data: suppliers = [] } = useSuppliers();
  const { data: orders = [] } = usePurchaseOrders();
  const { data: goodsReceives = [] } =
    useGoodsReceives();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold">
          Purchase Module
        </h1>

        <p className="mt-2 text-[var(--nebula-text-secondary)]">
          Manage suppliers, purchase orders, goods receiving and purchase history.
        </p>
      </div>

      {/* Supplier Management */}
      <section
        id="purchase-suppliers"
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold">
          Supplier Management
        </h2>

        <SupplierForm />

        <SupplierTable suppliers={suppliers} />
      </section>

      {/* Purchase Orders */}
      <section
        id="purchase-orders"
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold">
          Purchase Orders
        </h2>

        <PurchaseOrderForm />

        <PurchaseOrderTable orders={orders} />
      </section>

      {/* Goods Receiving */}
      <section
        id="purchase-goods-receiving"
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold">
          Goods Receiving
        </h2>

        <GoodsReceiveForm />

        <GoodsReceiveTable
          goodsReceives={goodsReceives}
        />
      </section>

      {/* Purchase History */}
      <section
        id="purchase-history"
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold">
          Purchase History
        </h2>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <h3 className="font-semibold">
              Orders
            </h3>
            <PurchaseOrderTable orders={orders} />
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">
              Received Goods
            </h3>
            <GoodsReceiveTable
              goodsReceives={goodsReceives}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
