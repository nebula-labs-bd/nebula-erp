type InventoryFiltersProps = {
  onSearch?: (value: string) => void;
};


export default function InventoryFilters({
  onSearch,
}: InventoryFiltersProps) {
  return (
    <div className="surface p-4">

      <input
        className="w-full rounded border p-2"
        placeholder="Search product..."
        onChange={(e) =>
          onSearch?.(
            e.target.value,
          )
        }
      />

    </div>
  );
}