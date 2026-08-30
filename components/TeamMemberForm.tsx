'use client';

import { useActionState, useState } from 'react';
import type { TeamMemberActionState } from '@/features/team/actions';
import { EXECUTIVE_BOARD_POSITIONS } from '@/lib/teamHierarchy';

type TeamMemberFormProps = {
  action: (state: TeamMemberActionState, formData: FormData) => Promise<TeamMemberActionState>;
  defaultValues?: {
    name: string;
    position: string;
    committee: string;
    bio: string;
    order: number;
  };
  hasExistingPhoto?: boolean;
  hasExistingSignature?: boolean;
  submitLabel: string;
};

const inputClasses =
  'mt-1 w-full rounded-md border border-guild-green/30 bg-background px-3 py-2 text-foreground focus:border-guild-green focus:ring-1 focus:ring-guild-green focus:outline-none';
const labelClasses = 'text-sm font-medium text-muted';

export function TeamMemberForm({
  action,
  defaultValues,
  hasExistingPhoto,
  hasExistingSignature,
  submitLabel,
}: TeamMemberFormProps) {
  const [state, formAction, isPending] = useActionState(action, undefined);

  const startsAsCustom = Boolean(
    defaultValues && !EXECUTIVE_BOARD_POSITIONS.includes(defaultValues.position)
  );
  const [isCustomPosition, setIsCustomPosition] = useState(startsAsCustom);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
      <div>
        <label htmlFor="name" className={labelClasses}>
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={defaultValues?.name}
          className={inputClasses}
        />
        {state?.errors?.name && (
          <p className="mt-1 text-sm text-red-400">{state.errors.name[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="position" className={labelClasses}>
          Position
        </label>
        {isCustomPosition ? (
          <>
            <input
              id="position"
              name="position"
              type="text"
              placeholder="e.g. Marketing Committee Head"
              required
              defaultValue={startsAsCustom ? defaultValues?.position : ''}
              className={inputClasses}
            />
            <button
              type="button"
              onClick={() => setIsCustomPosition(false)}
              className="mt-1 text-xs text-guild-green hover:underline"
            >
              Choose from Executive Board list instead
            </button>
          </>
        ) : (
          <select
            id="position"
            name="position"
            required
            defaultValue={!startsAsCustom ? defaultValues?.position : ''}
            onChange={(e) => {
              if (e.target.value === '__other__') setIsCustomPosition(true);
            }}
            className={inputClasses}
          >
            <option value="" disabled>
              Select a position
            </option>
            {EXECUTIVE_BOARD_POSITIONS.map((pos) => (
              <option key={pos} value={pos}>
                {pos}
              </option>
            ))}
            <option value="__other__">Other (committee-specific role)</option>
          </select>
        )}
        {state?.errors?.position && (
          <p className="mt-1 text-sm text-red-400">{state.errors.position[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="committee" className={labelClasses}>
          Committee (optional)
        </label>
        <input
          id="committee"
          name="committee"
          type="text"
          placeholder="Leave blank for Executive Board, or name a committee"
          defaultValue={defaultValues?.committee}
          className={inputClasses}
        />
        {state?.errors?.committee && (
          <p className="mt-1 text-sm text-red-400">{state.errors.committee[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="bio" className={labelClasses}>
          Short Bio (optional)
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={3}
          defaultValue={defaultValues?.bio}
          className={inputClasses}
        />
        {state?.errors?.bio && <p className="mt-1 text-sm text-red-400">{state.errors.bio[0]}</p>}
      </div>

      <div>
        <label htmlFor="order" className={labelClasses}>
          Display Order (only used to break ties within a committee)
        </label>
        <input
          id="order"
          name="order"
          type="number"
          defaultValue={defaultValues?.order ?? 0}
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="photo" className={labelClasses}>
          Photo (optional)
        </label>
        <input
          id="photo"
          name="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="mt-1 w-full text-sm text-foreground file:mr-4 file:rounded-md file:border-0 file:bg-guild-green file:px-4 file:py-2 file:text-sm file:font-bold file:tracking-wide file:text-background file:uppercase hover:file:bg-guild-green-dim"
        />
        {hasExistingPhoto && (
          <label className="mt-2 flex items-center gap-2 text-xs text-muted">
            <input type="checkbox" name="removePhoto" className="rounded" />
            Remove current photo
          </label>
        )}
      </div>

      <div>
        <label htmlFor="signature" className={labelClasses}>
          E-Signature (optional — used on generated member ID cards)
        </label>
        <input
          id="signature"
          name="signature"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="mt-1 w-full text-sm text-foreground file:mr-4 file:rounded-md file:border-0 file:bg-guild-green file:px-4 file:py-2 file:text-sm file:font-bold file:tracking-wide file:text-background file:uppercase hover:file:bg-guild-green-dim"
        />
        <p className="mt-1 text-xs text-muted">
          Best results with a transparent PNG of just the signature.
        </p>
        {hasExistingSignature && (
          <label className="mt-2 flex items-center gap-2 text-xs text-muted">
            <input type="checkbox" name="removeSignature" className="rounded" />
            Remove current signature
          </label>
        )}
      </div>

      {state?.message && !state.errors && <p className="text-sm text-red-400">{state.message}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="w-fit rounded-md bg-guild-green px-6 py-2.5 font-display text-sm font-bold tracking-wide text-background uppercase transition-colors hover:bg-guild-green-dim disabled:opacity-50"
      >
        {isPending ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}