'use client';

type ConfirmButtonProps = {
  children: React.ReactNode;
  confirmMessage?: string;
  className?: string;
};

export function ConfirmButton({
  children,
  confirmMessage = 'Are you sure? This cannot be undone.',
  className,
}: ConfirmButtonProps) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!window.confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
    >
      {children}
    </button>
  );
}