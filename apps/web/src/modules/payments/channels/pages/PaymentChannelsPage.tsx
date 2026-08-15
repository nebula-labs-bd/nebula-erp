import { useAccounts } from "../../../accounting/hooks/useAccounts";
import { usePaymentAccounts } from "../hooks/usePaymentAccounts";
import { useSettlements } from "../hooks/usePaymentAccounts";

import PaymentAccountForm from "../components/PaymentAccountForm";
import PaymentAccountTable from "../components/PaymentAccountTable";
import SettlementForm from "../components/SettlementForm";
import SettlementTable from "../components/SettlementTable";

import type { PaymentAccount } from "../types/channel.types";

export default function PaymentChannelsPage() {
  const { data: accounts = [] } = useAccounts();
  const { data: paymentAccounts = [] } = usePaymentAccounts();
  const { data: settlements = [] } = useSettlements();

  const bankAccounts = accounts.filter((a) => a.type === "asset" && a.status === "active");

  // Calculate balances per payment account
  const accountBalances = paymentAccounts.map((pa) => {
    const pendingSettlements = settlements
      .filter((s) => s.paymentAccountId === pa.id && s.status === "pending")
      .reduce((sum, s) => sum + s.amount, 0);

    const completedSettlements = settlements
      .filter((s) => s.paymentAccountId === pa.id && s.status === "completed")
      .reduce((sum, s) => sum + s.amount, 0);

    // Note: In a real system, we'd track the "received" amount separately
    // For now, we show what's been settled vs pending
    return {
      account: pa,
      pendingSettlement: pendingSettlements,
      completedSettlement: completedSettlements,
    };
  });

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold">Payment Channels & Settlement</h1>

        <p className="mt-2 text-[var(--nebula-text-secondary)]">
          Manage payment channels (cash, bank, mobile wallet, marketplace, gateway)
          and track their settlement into bank accounts. Settlement posts journal
          entries to the accounting engine.
        </p>
      </div>

      {/* Payment Accounts */}
      <section id="payment-channels-accounts" className="space-y-4">
        <h2 className="text-xl font-semibold">Payment Accounts (Channels)</h2>

        <PaymentAccountForm />

        <PaymentAccountTable accounts={paymentAccounts} />
      </section>

      {/* Account Balance Summary */}
      <section id="payment-channels-balances" className="space-y-4">
        <h2 className="text-xl font-semibold">Channel Balances & Settlement Status</h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {accountBalances.map(({ account, pendingSettlement, completedSettlement }) => (
            <div key={account.id} className="surface p-4 space-y-2 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{account.name}</h3>
                <span className={typeBadgeClass(account.type)}>
                  {formatType(account.type)}
                </span>
              </div>

              {account.provider && (
                <p className="text-sm text-[var(--nebula-text-secondary)]">
                  Provider: {account.provider}
                </p>
              )}

              <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t">
                <div>
                  <p className="text-xs text-[var(--nebula-text-secondary)]">
                    Pending Settlement
                  </p>
                  <p className="font-medium text-amber-600">
                    ${pendingSettlement.toFixed(2)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[var(--nebula-text-secondary)]">
                    Completed
                  </p>
                  <p className="font-medium text-green-600">
                    ${completedSettlement.toFixed(2)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[var(--nebula-text-secondary)]">
                    Net Position
                  </p>
                  <p className="font-medium">
                    ${(pendingSettlement + completedSettlement).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {accountBalances.length === 0 && (
          <div className="surface p-8 text-center text-[var(--nebula-text-secondary)]">
            No payment accounts configured. Add a payment account to track channels.
          </div>
        )}
      </section>

      {/* Settlements */}
      <section id="payment-channels-settlements" className="space-y-4">
        <h2 className="text-xl font-semibold">Settlements</h2>

        <SettlementForm bankAccounts={bankAccounts} />

        <SettlementTable
          settlements={settlements}
          bankAccounts={bankAccounts}
        />
      </section>
    </div>
  );
}

function typeBadgeClass(type: PaymentAccount["type"]): string {
  const colors: Record<PaymentAccount["type"], string> = {
    cash: "rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700",
    bank: "rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700",
    mobile_wallet:
      "rounded bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700",
    marketplace:
      "rounded bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700",
    gateway: "rounded bg-teal-100 px-2 py-1 text-xs font-medium text-teal-700",
  };
  return colors[type];
}

function formatType(type: PaymentAccount["type"]): string {
  return type
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}