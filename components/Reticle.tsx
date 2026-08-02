export function Reticle({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="12" r="7" />
      <line x1="12" y1="1" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="1" y1="12" x2="5" y2="12" />
      <line x1="19" y1="12" x2="23" y2="12" />
    </svg>
  );
}