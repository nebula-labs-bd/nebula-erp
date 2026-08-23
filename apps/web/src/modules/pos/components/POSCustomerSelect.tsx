import { useMemo, useState } from "react";

import { ChevronDown, UserRound } from "lucide-react";

import { useCustomers } from "../../sales/hooks/useCustomer";

import type { POSCustomer } from "../types/pos.types";

type POSCustomerSelectProps = {
  /** Currently selected POS customer (or null for walk-in). */
  value: POSCustomer | null;

  /** Called when the cashier picks a customer from the list. */
  onChange: (customer: POSCustomer | null) => void;
};

/**
 * Customer picker for the POS workspace.
 *
 * Reuses the existing Sales `useCustomers` query — the customer source of
 * truth is Sales/Contacts, never duplicated here. Maps the full `Customer`
 * record down to the minimal `POSCustomer` slice the checkout needs.
 */
export default function POSCustomerSelect({
  value,
  onChange,
}: POSCustomerSelectProps) {
  const { data: customers = [], isLoading } = useCustomers();

  const [open, setOpen] = useState(false);

  const options = useMemo(
    () =>
      customers.map((customer) => ({
        id: customer.id,
        customerId: customer.id,
        name: customer.name,
        customerCode: customer.taxNumber,
        email: customer.email,
        phone: customer.phone,
      })),
    [customers],
  );

  function select(customer: POSCustomer) {
    onChange(customer);

    setOpen(false);
  }

  return (
    <div className="surface p-4">
      <div className="mb-3 flex items-center gap-2">
        <UserRound
          size={18}
          className="text-[var(--nebula-text-secondary)]"
        />

        <h3 className="text-sm font-semibold text-[var(--nebula-text-primary)]">
          Customer
        </h3>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex w-full items-center justify-between rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface)] px-3 py-2 text-left text-sm text-[var(--nebula-text-primary)] transition-colors hover:bg-[var(--nebula-surface-muted)]"
        >
          <span className="truncate">
            {value ? (
              <>
                <span className="font-medium">
                  {value.name}
                </span>

                {value.phone && (
                  <span className="ml-2 text-[var(--nebula-text-muted)]">
                    {value.phone}
                  </span>
                )}
              </>
            ) : (
              <span className="text-[var(--nebula-text-muted)]">
                Walk-in customer
              </span>
            )}
          </span>

          <ChevronDown size={16} className="text-[var(--nebula-text-muted)]" />
        </button>

        {open && (
          <div className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface)] shadow-[var(--nebula-shadow-md)]">
            <button
              type="button"
              onClick={() => {
                onChange(null);

                setOpen(false);
              }}
              className="block w-full px-3 py-2 text-left text-sm text-[var(--nebula-text-muted)] transition-colors hover:bg-[var(--nebula-surface-muted)]"
            >
              Walk-in customer
            </button>

            {isLoading ? (
              <div className="px-3 py-2 text-sm text-[var(--nebula-text-muted)]">
                Loading customers…
              </div>
            ) : options.length === 0 ? (
              <div className="px-3 py-2 text-sm text-[var(--nebula-text-muted)]">
                No customers found.
              </div>
            ) : (
              options.map((customer) => (
                <button
                  key={customer.id}
                  type="button"
                  onClick={() => select(customer)}
                  className="block w-full px-3 py-2 text-left text-sm transition-colors hover:bg-[var(--nebula-surface-muted)]"
                >
                  <span className="font-medium text-[var(--nebula-text-primary)]">
                    {customer.name}
                  </span>

                  {customer.phone && (
                    <span className="ml-2 text-[var(--nebula-text-muted)]">
                      {customer.phone}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
