export function SectionBackground({ variant = 'dots' }: { variant?: 'dots' | 'glow' }) {
  if (variant === 'glow') {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-guild-green/10 absolute -top-16 -left-16 h-48 w-48 rounded-full blur-2xl sm:-top-24 sm:-left-24 sm:h-72 sm:w-72 sm:blur-3xl" />
        <div className="bg-guild-gold/10 absolute -right-16 -bottom-16 h-48 w-48 rounded-full blur-2xl sm:-right-24 sm:-bottom-24 sm:h-72 sm:w-72 sm:blur-3xl" />
      </div>
    );
  }

  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.05]"
      style={{
        backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        color: 'var(--color-guild-green, #1fae59)',
      }}
    />
  );
}