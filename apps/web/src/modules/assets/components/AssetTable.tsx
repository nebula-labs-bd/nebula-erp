import type {
  Asset,
  AssetCategory,
  AssetStatus,
} from "../types/asset.types";

type AssetTableProps = {
  assets: Asset[];
  categories?: AssetCategory[];
  onEdit?: (asset: Asset) => void;
  onDelete?: (id: string) => void;
};

function statusClass(status: AssetStatus): string {
  switch (status) {
    case "active":
      return "rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700";
    case "retired":
      return "rounded bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700";
    default:
      return "rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700";
  }
}

function categoryName(
  categoryId: string,
  categories?: AssetCategory[],
): string {
  const category = categories?.find((c) => c.id === categoryId);
  return category ? category.name : categoryId;
}

export default function AssetTable({
  assets,
  categories,
  onEdit,
  onDelete,
}: AssetTableProps) {
  return (
    <div className="surface overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Category</th>
            <th className="p-3 text-right">Purchase Value</th>
            <th className="p-3 text-right">Current Value</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {assets.map((asset) => (
            <tr key={asset.id} className="border-b">
              <td className="p-3 font-medium">{asset.name}</td>
              <td className="p-3">
                {categoryName(asset.categoryId, categories)}
              </td>
              <td className="p-3 text-right font-medium">
                ${asset.purchaseValue.toFixed(2)}
              </td>
              <td className="p-3 text-right font-medium">
                ${asset.currentValue.toFixed(2)}
              </td>
              <td className="p-3">
                <span className={statusClass(asset.status)}>
                  {asset.status}
                </span>
              </td>
              <td className="p-3 text-right">
                <div className="flex justify-end gap-2">
                  {onEdit && (
                    <button
                      className="rounded border px-2 py-1 text-xs"
                      onClick={() => onEdit(asset)}
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      className="rounded border border-red-300 px-2 py-1 text-xs text-red-700"
                      onClick={() => onDelete(asset.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}

          {assets.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="p-8 text-center text-[var(--nebula-text-secondary)]"
              >
                No assets registered yet. Register one to get started.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
