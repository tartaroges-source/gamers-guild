export function formatEventDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'Asia/Manila',
  }).format(date);
}

// Used on the generated ID card — no weekday/time, just a clean date.
export function formatDateOnly(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'Asia/Manila',
  }).format(date);
}

// HTML's <input type="datetime-local"> requires an exact "YYYY-MM-DDTHH:mm"
// format for its `defaultValue`. This converts a real Date into that shape,
// so editing an event pre-fills the date/time picker correctly.
export function toDateTimeLocalValue(date: Date | null | undefined): string {
  if (!date) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

// <input type="datetime-local"> gives a timezone-less string like
// "2026-10-07T07:00" — plain wall-clock digits with no indication of
// which timezone they belong to. Passed straight into `new Date(...)`,
// Node interprets it using the *server's* timezone (UTC on Vercel), not
// the organizer's — silently shifting every event time. Appending the
// fixed Manila UTC+8 offset before parsing makes the intended timezone
// explicit, so it's stored correctly regardless of where the code runs.
export function parseManilaDateTime(value: string): Date {
  return new Date(`${value}:00+08:00`);
}