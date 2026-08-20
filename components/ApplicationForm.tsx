'use client';

import { useActionState, useState } from 'react';
import { submitApplicationAction } from '@/features/applications/actions';
import { IdPictureUpload } from '@/components/IdPictureUpload';

const inputClasses =
  'mt-1 w-full rounded-md border border-guild-green/30 bg-background px-3 py-2 text-foreground focus:border-guild-green focus:ring-1 focus:ring-guild-green focus:outline-none';
const labelClasses = 'text-sm font-medium text-muted';

export function ApplicationForm() {
  const [state, formAction, isPending] = useActionState(submitApplicationAction, undefined);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'ONLINE'>('CASH');

  if (state?.success) {
    return (
      <div className="border-guild-green/30 bg-surface rounded-lg border p-8 text-center">
        <p className="font-display text-guild-green text-lg font-bold tracking-wide uppercase">
          Application received!
        </p>
        <p className="text-muted mt-2 text-sm">
          We&apos;ll review it and reach out to the email you provided.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div>
        <label htmlFor="fullName" className={labelClasses}>
          Full Name
        </label>
        <input id="fullName" name="fullName" type="text" required className={inputClasses} />
        {state?.errors?.fullName && (
          <p className="mt-1 text-sm text-red-400">{state.errors.fullName[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className={labelClasses}>
          Email
        </label>
        <input id="email" name="email" type="email" required className={inputClasses} />
        {state?.errors?.email && (
          <p className="mt-1 text-sm text-red-400">{state.errors.email[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="studentId" className={labelClasses}>
          Student ID
        </label>
        <input id="studentId" name="studentId" type="text" required className={inputClasses} />
        {state?.errors?.studentId && (
          <p className="mt-1 text-sm text-red-400">{state.errors.studentId[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="courseYear" className={labelClasses}>
          Course & Year Level
        </label>
        <input
          id="courseYear"
          name="courseYear"
          type="text"
          placeholder="e.g. BS Computer Science, 2nd Year"
          required
          className={inputClasses}
        />
        {state?.errors?.courseYear && (
          <p className="mt-1 text-sm text-red-400">{state.errors.courseYear[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="gamesPlayed" className={labelClasses}>
          What games do you play?
        </label>
        <input id="gamesPlayed" name="gamesPlayed" type="text" required className={inputClasses} />
        {state?.errors?.gamesPlayed && (
          <p className="mt-1 text-sm text-red-400">{state.errors.gamesPlayed[0]}</p>
        )}
      </div>

      <div>
        <IdPictureUpload />
        <div>
  <label className="text-sm font-medium text-muted">Payment Method</label>
  <div className="mt-2 flex gap-4">
    <label className="flex items-center gap-2 text-sm text-foreground">
      <input
        type="radio"
        name="paymentMethod"
        value="CASH"
        checked={paymentMethod === 'CASH'}
        onChange={() => setPaymentMethod('CASH')}
      />
      Cash
    </label>
    <label className="flex items-center gap-2 text-sm text-foreground">
      <input
        type="radio"
        name="paymentMethod"
        value="ONLINE"
        checked={paymentMethod === 'ONLINE'}
        onChange={() => setPaymentMethod('ONLINE')}
      />
      Online / Bank Transfer
    </label>
  </div>
</div>

{paymentMethod === 'ONLINE' && (
  <div>
    <label htmlFor="paymentProof" className={labelClasses}>
      Payment Receipt (clear photo showing the reference number)
    </label>
    <input
      id="paymentProof"
      name="paymentProof"
      type="file"
      accept="image/jpeg,image/png,image/webp"
      required
      className="mt-1 w-full text-sm text-foreground file:mr-4 file:rounded-md file:border-0 file:bg-guild-green file:px-4 file:py-2 file:text-sm file:font-bold file:tracking-wide file:text-background file:uppercase hover:file:bg-guild-green-dim"
    />
  </div>
)}
      </div>

      <div>
        <label htmlFor="message" className={labelClasses}>
          Why do you want to join?
        </label>
        <textarea id="message" name="message" rows={4} required className={inputClasses} />
        {state?.errors?.message && (
          <p className="mt-1 text-sm text-red-400">{state.errors.message[0]}</p>
        )}
      </div>

      {state?.message && !state.errors && <p className="text-sm text-red-400">{state.message}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="bg-guild-green font-display text-background hover:bg-guild-green-dim w-fit rounded-md px-6 py-2.5 text-sm font-bold tracking-wide uppercase transition-colors disabled:opacity-50"
      >
        {isPending ? 'Submitting...' : 'Submit Application'}
      </button>
    </form>
  );
}
