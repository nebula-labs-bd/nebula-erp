import AccountForm from "../components/AccountForm";
import AccountTable from "../components/AccountTable";
import JournalEntryForm from "../components/JournalEntryForm";
import JournalEntryTable from "../components/JournalEntryTable";
import GeneralLedgerTable from "../components/GeneralLedgerTable";

import { useAccounts } from "../hooks/useAccounts";
import {
  useJournalEntries,
  useJournalMutation,
} from "../hooks/useJournalEntries";
import { useGeneralLedger } from "../hooks/useGeneralLedger";

export default function AccountingPage() {
  const { data: accounts = [] } = useAccounts();
  const { data: journalEntries = [] } = useJournalEntries();
  const { data: ledger = [] } = useGeneralLedger();
  const { post } = useJournalMutation();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold">Accounting Module</h1>

        <p className="mt-2 text-[var(--nebula-text-secondary)]">
          Manage the chart of accounts, journal entries and the general ledger.
          Accounting records financial events only and never mutates inventory,
          products or stock quantities.
        </p>
      </div>

      {/* Chart of Accounts */}
      <section id="accounting-accounts" className="space-y-4">
        <h2 className="text-xl font-semibold">Chart of Accounts</h2>

        <AccountForm accounts={accounts} />

        <AccountTable accounts={accounts} />
      </section>

      {/* Journal Entries */}
      <section id="accounting-journal" className="space-y-4">
        <h2 className="text-xl font-semibold">Journal Entries</h2>

        <JournalEntryForm accounts={accounts} />

        <JournalEntryTable
          entries={journalEntries}
          onPost={(id) => post.mutate(id)}
        />
      </section>

      {/* General Ledger */}
      <section id="accounting-ledger" className="space-y-4">
        <h2 className="text-xl font-semibold">General Ledger</h2>

        <GeneralLedgerTable entries={ledger} />
      </section>
    </div>
  );
}