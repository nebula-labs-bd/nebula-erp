import { useMemo, useState } from "react";

import {
  useGoodsReceiveMutation,
} from "../hooks/useGoodsReceive";

import {
  usePurchaseOrders,
} from "../hooks/usePurchaseOrder";

import {
  useWarehouses,
} from "../../inventory/hooks/useWarehouse";

import {
  useProducts,
} from "../../inventory/hooks/useProducts";

import {
  useUnitConversions,
} from "../../inventory/hooks/useUnitConversions";

import {
  convertBetweenUnits,
} from "../../inventory/utils/unitConversion";

import type {
  ProductMaster,
} from "../../inventory/types/product.types";

import type {
  UnitConversion,
} from "../../inventory/types/unit.types";

import type {
  GoodsReceiveItem,
} from "../types/purchase.types";


let grLineCounter = 0;

function nextGrLineId() {
  grLineCounter += 1;

  return `gr-line-${grLineCounter}`;
}


type ReceiveLineState = {
  id: string;
  productId: string;
  productName: string;
  unitId: string;
  orderedQuantity: number;
  receivedQuantity: number;
  baseQuantity: number;
};


export default function GoodsReceiveForm() {
  const { create } = useGoodsReceiveMutation();

  const { data: orders = [] } = usePurchaseOrders();
  const { data: warehouses = [] } = useWarehouses();
  const { data: products = [] } = useProducts();
  const { data: conversions = [] } =
    useUnitConversions();

  const [purchaseOrderId, setPurchaseOrderId] =
    useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [lines, setLines] = useState<ReceiveLineState[]>(
    [],
  );

  const selectedOrder = useMemo(
    () =>
      orders.find(
        (order) => order.id === purchaseOrderId,
      ),
    [orders, purchaseOrderId],
  );

  function loadOrderItems() {
    if (!selectedOrder) {
      setLines([]);

      return;
    }

    const loaded: ReceiveLineState[] =
      selectedOrder.items.map((item) => {
        const product = products.find(
          (p) => p.id === item.productId,
        ) as ProductMaster | undefined;

        return {
          id: nextGrLineId(),
          productId: item.productId,
          productName:
            product?.name ?? item.productId,
          unitId: item.unitId,
          orderedQuantity: item.quantity,
          receivedQuantity: item.quantity,
          baseQuantity: computeBaseQuantity(
            item.quantity,
            item.unitId,
            product,
            conversions,
          ),
        };
      });

    setLines(loaded);
  }

  function computeBaseQuantity(
    quantity: number,
    unitId: string,
    product: ProductMaster | undefined,
    convs: UnitConversion[],
  ): number {
    if (!product?.unitId || !unitId) {
      return quantity;
    }

    const result = convertBetweenUnits(
      quantity,
      unitId,
      product.unitId,
      convs,
    );

    return result ?? quantity;
  }

  function onOrderChange(value: string) {
    setPurchaseOrderId(value);

    setLines([]);
  }

  function updateLine(
    id: string,
    patch: Partial<ReceiveLineState>,
  ) {
    setLines((prev) =>
      prev.map((line) =>
        line.id === id
          ? { ...line, ...patch }
          : line,
      ),
    );
  }
  function onReceivedChange(
    line: ReceiveLineState,
    received: number,
  ) {
    const product = products.find(
      (p) => p.id === line.productId,
    ) as ProductMaster | undefined;

    updateLine(line.id, {
      receivedQuantity: received,
      baseQuantity: computeBaseQuantity(
        received,
        line.unitId,
        product,
        conversions,
      ),
    });
  }

  function submit() {
    if (
      !purchaseOrderId ||
      !warehouseId ||
      lines.length === 0
    ) {
      return;
    }

    const items: GoodsReceiveItem[] = lines.map(
      (line) => ({
        id: line.id,
        productId: line.productId,
        productName: line.productName,
        unitId: line.unitId,
        orderedQuantity: line.orderedQuantity,
        receivedQuantity: line.receivedQuantity,
        baseQuantity: line.baseQuantity,
      }),
    );

    const allReceived = items.every(
      (item) =>
        item.receivedQuantity >= item.orderedQuantity,
    );

    const status = allReceived ? "received" : "partial";

    create.mutate({
      purchaseOrderId,
      warehouseId,
      date,
      items,
      status,
    });

    setPurchaseOrderId("");
    setWarehouseId("");
    setLines([]);
  }

  return (
    <div className="surface p-5 space-y-4">
      <h2 className="text-xl font-bold">
        Goods Receiving
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <select
          className="w-full rounded border p-2"
          value={purchaseOrderId}
          onChange={(e) =>
            onOrderChange(e.target.value)
          }
        >
          <option value="">
            Select Purchase Order
          </option>
          {orders
            .filter(
              (order) =>
                order.status !== "cancelled",
            )
            .map((order) => (
              <option
                key={order.id}
                value={order.id}
              >
                {order.orderNumber}
              </option>
            ))}
        </select>

        <select
          className="w-full rounded border p-2"
          value={warehouseId}
          onChange={(e) =>
            setWarehouseId(e.target.value)
          }
        >
          <option value="">
            Select Warehouse
          </option>
          {warehouses.map((warehouse) => (
            <option
              key={warehouse.id}
              value={warehouse.id}
            >
              {warehouse.name}
            </option>
          ))}
        </select>
      </div>

      <input
        className="w-full rounded border p-2"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <button
        className="rounded border px-4 py-2 text-sm"
        onClick={loadOrderItems}
        disabled={!selectedOrder}
      >
        Load Order Items
      </button>

      <div className="space-y-3">
        {lines.map((line) => (
          <div
            key={line.id}
            className="space-y-2 rounded border p-3"
          >
            <div className="font-medium">
              {line.productName}
            </div>
            <div className="text-sm opacity-60">
              Ordered: {line.orderedQuantity} |
              Unit: {line.unitId}
            </div>
            <input
              className="w-full rounded border p-2"
              type="number"
              placeholder="Received Quantity"
              value={line.receivedQuantity}
              onChange={(e) =>
                onReceivedChange(
                  line,
                  Number(e.target.value),
                )
              }
            />
            <div className="text-sm">
              Base Quantity: {line.baseQuantity}
            </div>
          </div>
        ))}
      </div>

      <button
        className="rounded bg-black px-4 py-2 text-white"
        onClick={submit}
        disabled={
          !purchaseOrderId ||
          !warehouseId ||
          lines.length === 0
        }
      >
        Receive Goods
      </button>
    </div>
  );
}

