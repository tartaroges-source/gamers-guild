'use client';

import { useActionState, useEffect, useState } from 'react';
import Link from 'next/link';
import { submitApplicationAction } from '@/features/applications/actions';
import { IdPictureUpload } from '@/components/IdPictureUpload';
import { CourseSelect } from '@/components/CourseSelect';

const baseInputClasses =
  'mt-1 w-full rounded-md border bg-background px-3 py-2 text-foreground focus:ring-1 focus:outline-none';
const normalBorder = 'border-guild-green/30 focus:border-guild-green focus:ring-guild-green';
const errorBorder = 'border-red-400 focus:border-red-400 focus:ring-red-400';
const labelClasses = 'text-sm font-medium text-muted';
const errorTextClasses = 'mt-1 text-sm text-red-400';

function fieldClasses(hasError: boolean) {
  return `${baseInputClasses} ${hasError ? errorBorder : normalBorder}`;
}

const initialValues = {
  fullName: '',
  email: '',
  studentId: '',
  gamesPlayed: '',
  message: '',
  department: '',
  course: '',
  yearLevel: '',
};

export function ApplicationForm() {
  const [state, formAction, isPending] = useActionState(submitApplicationAction, undefined);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'ONLINE'>('CASH');
  const [values, setValues] = useState(initialValues);

  // After each submission attempt, clear only the field(s) that actually
  // failed validation — everything else keeps whatever the person typed,
  // so a single mistake doesn't force them to redo the entire form.
  useEffect(() => {
    if (!state) return;

    if (state.success) {
      setValues(initialValues);
      setPaymentMethod('CASH');
      return;
    }

    if (state.errors) {
      setValues((prev) => {
        const next = { ...prev };
        for (const key of Object.keys(state.errors ?? {})) {
          if (key in next) {
            next[key as keyof typeof next] = '';
          }
        }
        return next;
      });
    }
  }, [state]);

  function setField(name: keyof typeof initialValues) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setValues((prev) => ({ ...prev, [name]: e.target.value }));
    };
  }

  return (
    <>
      <form action={formAction} className="flex flex-col gap-5">
        <div>
          <label htmlFor="fullName" className={labelClasses}>
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            value={values.fullName}
            onChange={setField('fullName')}
            className={fieldClasses(Boolean(state?.errors?.fullName))}
          />
          {state?.errors?.fullName && (
            <p className={errorTextClasses}>{state.errors.fullName[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className={labelClasses}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={values.email}
            onChange={setField('email')}
            className={fieldClasses(Boolean(state?.errors?.email))}
          />
          {state?.errors?.email && <p className={errorTextClasses}>{state.errors.email[0]}</p>}
        </div>

        <div>
          <label htmlFor="studentId" className={labelClasses}>
            Student ID
          </label>
          <input
            id="studentId"
            name="studentId"
            type="text"
            inputMode="numeric"
            pattern="\d{7}"
            maxLength={7}
            placeholder="7-digit student number"
            required
            value={values.studentId}
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                studentId: e.target.value.replace(/\D/g, '').slice(0, 7),
              }))
            }
            className={fieldClasses(Boolean(state?.errors?.studentId))}
          />
          {state?.errors?.studentId ? (
            <p className={errorTextClasses}>{state.errors.studentId[0]}</p>
          ) : (
            <p className="text-muted mt-1 text-xs">Exactly 7 digits, numbers only.</p>
          )}
        </div>

        <div>
          <CourseSelect
            department={values.department}
            course={values.course}
            onDepartmentChange={(value) =>
              setValues((prev) => ({ ...prev, department: value, course: '' }))
            }
            onCourseChange={(value) => setValues((prev) => ({ ...prev, course: value }))}
            departmentError={state?.errors?.department?.[0]}
            courseError={state?.errors?.course?.[0]}
          />
        </div>

        <div>
          <label htmlFor="yearLevel" className={labelClasses}>
            Year Level
          </label>
          <select
            id="yearLevel"
            name="yearLevel"
            required
            value={values.yearLevel}
            onChange={setField('yearLevel')}
            className={fieldClasses(Boolean(state?.errors?.yearLevel))}
          >
            <option value="" disabled>
              Select year level
            </option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>
          {state?.errors?.yearLevel && (
            <p className={errorTextClasses}>{state.errors.yearLevel[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="gamesPlayed" className={labelClasses}>
            What games do you play?
          </label>
          <input
            id="gamesPlayed"
            name="gamesPlayed"
            type="text"
            required
            value={values.gamesPlayed}
            onChange={setField('gamesPlayed')}
            className={fieldClasses(Boolean(state?.errors?.gamesPlayed))}
          />
          {state?.errors?.gamesPlayed && (
            <p className={errorTextClasses}>{state.errors.gamesPlayed[0]}</p>
          )}
        </div>

        <div>
          <IdPictureUpload />

          <div className="mt-5">
            <label className={labelClasses}>Payment Method</label>
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
            <div className="mt-5">
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
          <textarea
            id="message"
            name="message"
            rows={4}
            required
            value={values.message}
            onChange={setField('message')}
            className={fieldClasses(Boolean(state?.errors?.message))}
          />
          {state?.errors?.message && <p className={errorTextClasses}>{state.errors.message[0]}</p>}
        </div>

        {state?.message && (
          <p className="border-red-400/40 bg-red-400/10 rounded-md border px-3 py-2 text-sm text-red-400">
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="bg-guild-green font-display text-background hover:bg-guild-green-dim w-fit rounded-md px-6 py-2.5 text-sm font-bold tracking-wide uppercase transition-colors disabled:opacity-50"
        >
          {isPending ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>

      {state?.success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="border-guild-green/30 bg-surface w-full max-w-sm rounded-lg border p-8 text-center">
            <p className="font-display text-guild-green text-lg font-bold tracking-wide uppercase">
              Thank you for applying!
            </p>
            <p className="text-muted mt-2 text-sm">
              We&apos;ll review your application and reach out to the email you provided.
            </p>
            <Link
              href="/"
              className="btn-glossy font-display text-background mt-6 inline-block rounded-md px-6 py-2.5 text-sm font-bold tracking-wide uppercase"
            >
              Return to Home
            </Link>
          </div>
        </div>
      )}
    </>
  );
}