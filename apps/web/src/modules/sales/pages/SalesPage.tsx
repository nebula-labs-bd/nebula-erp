import CustomerForm from "../components/CustomerForm";
import CustomerTable from "../components/CustomerTable";
import SalesOrderForm from "../components/SalesOrderForm";
import SalesOrderTable from "../components/SalesOrderTable";
import DeliveryForm from "../components/DeliveryForm";
import DeliveryTable from "../components/DeliveryTable";
import SalesTable from "../components/SalesTable";

import {
  useCustomers,
} from "../hooks/useCustomer";

import {
  useSalesOrders,
} from "../hooks/useSalesOrder";

import {
  useDeliveries,
} from "../hooks/useDelivery";


export default function SalesPage() {
  const { data: customers = [] } = useCustomers();
  const { data: orders = [] } = useSalesOrders();
  const { data: deliveries = [] } = useDeliveries();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold">
          Sales Module
        </h1>

        <p className="mt-2 text-[var(--nebula-text-secondary)]">
          Manage customers, sales orders, deliveries and sales history.
        </p>
      </div>

      {/* Customer Management */}
      <section
        id="sales-customers"
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold">
          Customer Management
        </h2>

        <CustomerForm />

        <CustomerTable customers={customers} />
      </section>

      {/* Sales Orders */}
      <section
        id="sales-orders"
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold">
          Sales Orders
        </h2>

        <SalesOrderForm />

        <SalesOrderTable orders={orders} />
      </section>

      {/* Delivery / Stock Deduction */}
      <section
        id="sales-delivery"
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold">
          Delivery / Stock Deduction
        </h2>

        <DeliveryForm />

        <DeliveryTable deliveries={deliveries} />
      </section>

      {/* Sales History */}
      <section
        id="sales-history"
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold">
          Sales History
        </h2>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <h3 className="font-semibold">
              Orders
            </h3>
            <SalesTable orders={orders} />
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">
              Deliveries
            </h3>
            <DeliveryTable deliveries={deliveries} />
          </div>
        </div>
      </section>
    </div>
  );
}
