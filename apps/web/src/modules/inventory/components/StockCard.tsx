type StockCardProps = {
  title: string;
  value: string | number;
};


export default function StockCard({
  title,
  value,
}: StockCardProps) {
  return (
    <div className="surface p-5">
      <p className="text-sm text-[var(--nebula-text-secondary)]">
        {title}
      </p>

      <h2 className="mt-2 text-3xl font-bold">
        {value}
      </h2>
    </div>
  );
}