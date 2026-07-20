export default function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-[var(--nebula-border)] bg-[var(--nebula-surface)] px-6">
      <h2 className="text-lg font-semibold text-[var(--nebula-text-primary)]">
        Dashboard
      </h2>

      <div className="text-sm text-[var(--nebula-text-secondary)]">
        Admin User
      </div>
    </header>
  );
}