import type {
  Transaction,
} from "../types/accounting.types";


type TransactionTableProps = {
  transactions: Transaction[];
};


export default function TransactionTable({
  transactions,
}: TransactionTableProps) {
  return (
    <div className="surface overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">
              Type
            </th>

            <th className="p-3 text-left">
              Description
            </th>

            <th className="p-3 text-left">
              Date
            </th>

            <th className="p-3 text-left">
              Amount
            </th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((transaction) => (
            <tr
              key={transaction.id}
              className="border-b"
            >
              <td className="p-3">
                {transaction.type}
              </td>

              <td className="p-3">
                {transaction.description}
              </td>

              <td className="p-3">
                {transaction.date}
              </td>

              <td className="p-3">
                ${transaction.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}