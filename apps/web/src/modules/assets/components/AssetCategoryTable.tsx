import type {
  AssetCategory,
  AssetCategoryStatus,
} from "../types/asset.types";

type AssetCategoryTableProps = {
  categories: AssetCategory[];
  onEdit?: (category: AssetCategory) => void;
  onDelete?: (id: string) => void;
};

function statusClass(status: AssetCategoryStatus): string {
  return status === "active"
    ? "rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700"
    : "rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700";
}

export default function AssetCategoryTable({
  categories,
  onEdit,
  onDelete,
}: AssetCategoryTableProps) {
  return (
    <div className="surface overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Description</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((category) => (
            <tr key={category.id} className="border-b">
              <td className="p-3 font-medium">{category.name}</td>
              <td className="p-3">{category.description || "-"}</td>
              <td className="p-3">
                <span className={statusClass(category.status)}>
                  {category.status}
                </span>
              </td>
              <td className="p-3 text-right">
                <div className="flex justify-end gap-2">
                  {onEdit && (
                    <button
                      className="rounded border px-2 py-1 text-xs"
                      onClick={() => onEdit(category)}
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      className="rounded border border-red-300 px-2 py-1 text-xs text-red-700"
                      onClick={() => onDelete(category.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}

          {categories.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="p-8 text-center text-[var(--nebula-text-secondary)]"
              >
                No asset categories yet. Create one to get started.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
