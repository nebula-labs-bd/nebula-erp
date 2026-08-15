import { useMemo, useState } from "react";

import {
  useSalesOrderMutation,
} from "../hooks/useSalesOrder";

import {
  useCustomers,
} from "../hooks/useCustomer";

import {
  useProducts,
} from "../../inventory/hooks/useProducts";

import {
  useUnits,
} from "../../inventory/hooks/useUnits";

import type {
  ProductMaster,
} from "../../inventory/types/product.types";

import type {
  Unit,
} from "../../inventory/types/unit.types";

import type {
  SalesOrderItem,
} from "../types/sales.types";


let lineCounter = 0;

function nextLineId() {
  lineCounter += 1;

  return `so-line-${lineCounter}`;
}


type SalesOrderFormProps = {
  orderNumber?: string;
};


type LineState = {
  id: string;
  productId: string;
  quantity: number;
  unitId: string;
  sellingPrice: number;
  tax: number;
  discount: number;
};


const emptyLine = (): LineState => ({
  id: nextLineId(),
  productId: "",
  quantity: 0,
  unitId: "",
  sellingPrice: 0,
  tax: 0,
  discount: 0,
});


function computeLineTotal(line: LineState): number {
  const gross = line.quantity * line.sellingPrice;

  const afterDiscount = gross - line.discount;

  const withTax = afterDiscount + line.tax;

  return Number(withTax.toFixed(2));
}


export default function SalesOrderForm({
  orderNumber,
}: SalesOrderFormProps) {
  const { create } = useSalesOrderMutation();

  const { data: customers = [] } = useCustomers();
  const { data: products = [] } = useProducts();
  const { data: units = [] } = useUnits();

  const [customerId, setCustomerId] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [lines, setLines] = useState<LineState[]>([
    emptyLine(),
  ]);

  const generatedOrderNumber =
    orderNumber ??
    `SO-${new Date().getFullYear()}-${String(
      Math.floor(Math.random() * 9000) + 1000,
    )}`;

  const totals = useMemo(() => {
    const items: SalesOrderItem[] = lines
      .filter((line) => line.productId)
      .map((line) => ({
        id: line.id,
        productId: line.productId,
        quantity: line.quantity,
        unitId: line.unitId,
        sellingPrice: line.sellingPrice,
        tax: line.tax,
        discount: line.discount,
        total: computeLineTotal(line),
      }));

    const subtotal = Number(
      items
        .reduce(
          (sum, item) => sum + (item.sellingPrice * item.quantity),
          0,
        )
        .toFixed(2),
    );

    const tax = Number(
      items.reduce((sum, item) => sum + item.tax, 0).toFixed(2),
    );

    const discount = Number(
      items
        .reduce((sum, item) => sum + item.discount, 0)
        .toFixed(2),
    );

    const total = Number(
      items.reduce((sum, item) => sum + item.total, 0).toFixed(2),
    );

    return {
      items,
      subtotal,
      tax,
      discount,
      total,
    };
  }, [lines]);

  function updateLine(
    id: string,
    patch: Partial<LineState>,
  ) {
    setLines((prev) =>
      prev.map((line) =>
        line.id === id
          ? { ...line, ...patch }
          : line,
      ),
    );
  }

  function addLine() {
    setLines((prev) => [...prev, emptyLine()]);
  }

  function removeLine(id: string) {
    setLines((prev) =>
      prev.filter((line) => line.id !== id),
    );
  }

  function onProductChange(
    line: LineState,
    productId: string,
  ) {
    const product = products.find(
      (p) => p.id === productId,
    ) as ProductMaster | undefined;

    const unit = units.find(
      (u) => u.id === product?.unitId,
    ) as Unit | undefined;

    updateLine(line.id, {
      productId,
      unitId: unit?.id ?? "",
      sellingPrice: product?.sellingPrice ?? 0,
    });
  }

  function submit() {
    if (!customerId || totals.items.length === 0) {
      return;
    }

    create.mutate({
      customerId,
      orderNumber: generatedOrderNumber,
      date,
      status: "draft",
      items: totals.items,
      subtotal: totals.subtotal,
      tax: totals.tax,
      discount: totals.discount,
      total: totals.total,
    });

    setCustomerId("");
    setLines([emptyLine()]);
  }

  return (
    <div className="surface p-5 space-y-4">
      <h2 className="text-xl font-bold">
        Create Sales Order
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <select
          className="w-full rounded border p-2"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
        >
          <option value="">Select Customer</option>
          {customers.map((customer) => (
            <option
              key={customer.id}
              value={customer.id}
            >
              {customer.name}
            </option>
          ))}
        </select>

        <input
          className="w-full rounded border p-2"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        {lines.map((line) => (
          <div
            key={line.id}
            className="space-y-2 rounded border p-3"
          >
            <div className="grid grid-cols-2 gap-3">
              <select
                className="w-full rounded border p-2"
                value={line.productId}
                onChange={(e) =>
                  onProductChange(line, e.target.value)
                }
              >
                <option value="">
                  Select Product
                </option>
                {products.map((product) => (
                  <option
                    key={product.id}
                    value={product.id}
                  >
                    {product.name} ({product.sku})
                  </option>
                ))}
              </select>

              <select
                className="w-full rounded border p-2"
                value={line.unitId}
                onChange={(e) =>
                  updateLine(line.id, {
                    unitId: e.target.value,
                  })
                }
              >
                <option value="">Select Unit</option>
                {units.map((unit) => (
                  <option
                    key={unit.id}
                    value={unit.id}
                  >
                    {unit.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-4 gap-3">
              <input
                className="w-full rounded border p-2"
                type="number"
                placeholder="Qty"
                value={line.quantity}
                onChange={(e) =>
                  updateLine(line.id, {
                    quantity: Number(e.target.value),
                  })
                }
              />

              <input
                className="w-full rounded border p-2"
                type="number"
                placeholder="Price"
                value={line.sellingPrice}
                onChange={(e) =>
                  updateLine(line.id, {
                    sellingPrice: Number(e.target.value),
                  })
                }
              />

              <input
                className="w-full rounded border p-2"
                type="number"
                placeholder="Tax"
                value={line.tax}
                onChange={(e) =>
                  updateLine(line.id, {
                    tax: Number(e.target.value),
                  })
                }
              />

              <input
                className="w-full rounded border p-2"
                type="number"
                placeholder="Discount"
                value={line.discount}
                onChange={(e) =>
                  updateLine(line.id, {
                    discount: Number(e.target.value),
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                Line Total: ${computeLineTotal(line).toFixed(2)}
              </div>

              <button
                className="rounded border px-3 py-1 text-sm"
                onClick={() => removeLine(line.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        className="rounded border px-4 py-2 text-sm"
        onClick={addLine}
      >
        Add Line
      </button>

      <div className="rounded border p-3 text-sm">
        <div>
          Subtotal: ${totals.subtotal.toFixed(2)}
        </div>
        <div>
          Tax: ${totals.tax.toFixed(2)}
        </div>
        <div>
          Discount: ${totals.discount.toFixed(2)}
        </div>
        <div className="font-semibold">
          Total: ${totals.total.toFixed(2)}
        </div>
      </div>

      <button
        className="rounded bg-black px-4 py-2 text-white"
        onClick={submit}
        disabled={
          !customerId || totals.items.length === 0
        }
      >
        Create Sales Order
      </button>
    </div>
  );
}
