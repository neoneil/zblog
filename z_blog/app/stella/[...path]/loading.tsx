export default function StellaLoading() {
  return (
    <div
      className="grid min-h-[65svh] place-items-center bg-[var(--explore-bg)] text-[var(--explore-title)]"
      role="status"
      aria-label="Stella loading"
    >
      <span>Stella…</span>
    </div>
  );
}
