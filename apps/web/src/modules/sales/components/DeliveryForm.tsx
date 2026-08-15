import { useMemo, useState } from "react";

import {
  useDeliveryMutation,
} from "../hooks/useDelivery";

import {
  useSalesOrders,
} from "../hooks/useSalesOrder";

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
  DeliveryItem,
} from "../types/sales.types";


let deliveryLineCounter = 0;

function nextDeliveryLineId() {
  deliveryLineCounter += 1;

  return `delivery-line-${deliveryLineCounter}`;
}


type DeliveryLineState = {
  id: string;
  productId: string;
  productName: string;
  unitId: string;
  orderedQuantity: number;
  deliveredQuantity: number;
  baseQuantity: number;
};


export default function DeliveryForm() {
  const { create } = useDeliveryMutation();

  const { data: orders = [] } = useSalesOrders();
  const { data: warehouses = [] } = useWarehouses();
  const { data: products = [] } = useProducts();
  const { data: conversions = [] } =
    useUnitConversions();

  const [salesOrderId, setSalesOrderId] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [lines, setLines] = useState<DeliveryLineState[]>(
    [],
  );

  const selectedOrder = useMemo(
    () =>
      orders.find(
        (order) => order.id === salesOrderId,
      ),
    [orders, salesOrderId],
  );

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

  function loadOrderItems() {
    if (!selectedOrder) {
      setLines([]);

      return;
    }

    const loaded: DeliveryLineState[] =
      selectedOrder.items.map((item) => {
        const product = products.find(
          (p) => p.id === item.productId,
        ) as ProductMaster | undefined;

        return {
          id: nextDeliveryLineId(),
          productId: item.productId,
          productName:
            product?.name ?? item.productId,
          unitId: item.unitId,
          orderedQuantity: item.quantity,
          deliveredQuantity: item.quantity,
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

  function onOrderChange(value: string) {
    setSalesOrderId(value);

    setLines([]);
  }

  function updateLine(
    id: string,
    patch: Partial<DeliveryLineState>,
  ) {
    setLines((prev) =>
      prev.map((line) =>
        line.id === id
          ? { ...line, ...patch }
          : line,
      ),
    );
  }

  function onDeliveredChange(
    line: DeliveryLineState,
    deliveredQuantity: number,
  ) {
    const product = products.find(
      (p) => p.id === line.productId,
    ) as ProductMaster | undefined;

    updateLine(line.id, {
      deliveredQuantity,
      baseQuantity: computeBaseQuantity(
        deliveredQuantity,
        line.unitId,
        product,
        conversions,
      ),
    });
  }

  function submit() {
    if (
      !salesOrderId ||
      !warehouseId ||
      lines.length === 0
    ) {
      return;
    }

    const items: DeliveryItem[] = lines.map((line) => ({
      id: line.id,
      productId: line.productId,
      productName: line.productName,
      unitId: line.unitId,
      orderedQuantity: line.orderedQuantity,
      deliveredQuantity: line.deliveredQuantity,
      baseQuantity: line.baseQuantity,
    }));

    const allDelivered = lines.every(
      (item) =>
        item.deliveredQuantity >= item.orderedQuantity,
    );

    const status = allDelivered ? "delivered" : "partial";

    create.mutate({
      salesOrderId,
      warehouseId,
      date,
      items,
      status,
    });

    setSalesOrderId("");
    setWarehouseId("");
    setLines([]);
  }

  return (
    <div className="surface p-5 space-y-4">
      <h2 className="text-xl font-bold">
        Delivery / Stock Deduction
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <select
          className="w-full rounded border p-2"
          value={salesOrderId}
          onChange={(e) => onOrderChange(e.target.value)}
        >
          <option value="">
            Select Sales Order
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
              placeholder="Delivered Quantity"
              value={line.deliveredQuantity}
              onChange={(e) =>
                onDeliveredChange(
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
          !salesOrderId ||
          !warehouseId ||
          lines.length === 0
        }
      >
        Confirm Delivery
      </button>
    </div>
  );
}

