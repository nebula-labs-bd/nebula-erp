import StockCard from "./StockCard";


type InventoryStatsProps = {
  totalProducts: number;
  totalStock: number;
  lowStock: number;
  value: number;
};


export default function InventoryStats({
  totalProducts,
  totalStock,
  lowStock,
  value,
}: InventoryStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <StockCard
        title="Products"
        value={totalProducts}
      />

      <StockCard
        title="Total Stock"
        value={totalStock}
      />

      <StockCard
        title="Low Stock"
        value={lowStock}
      />

      <StockCard
        title="Inventory Value"
        value={`$${value}`}
      />
    </div>
  );
}