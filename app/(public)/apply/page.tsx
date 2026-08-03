import { ApplicationForm } from '@/components/ApplicationForm';

export default function ApplyPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-foreground text-4xl font-bold tracking-wide uppercase">
        Join the Guild
      </h1>
      <p className="text-muted mt-2">
        Applications are reviewed by our officers — we&apos;ll be in touch soon.
      </p>
      <div className="mt-10">
        <ApplicationForm />
      </div>
    </div>
  );
}
