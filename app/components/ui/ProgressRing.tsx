export function ProgressRing({ value, size = 84 }: { value: number; size?: number }) {
  const radius = 42;
  const circumference = Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 55" className="absolute inset-0 size-full overflow-visible" aria-hidden="true">
        <path d="M8 50a42 42 0 0 1 84 0" pathLength="100" fill="none" stroke="rgba(11,18,32,.10)" strokeWidth="8" strokeLinecap="round" />
        <path d="M8 50a42 42 0 0 1 84 0" pathLength="100" fill="none" stroke="var(--mint)" strokeWidth="8" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} />
      </svg>
      <span className="mt-5 text-lg font-semibold text-[color:var(--ink)]">{value}%</span>
    </div>
  );
}
