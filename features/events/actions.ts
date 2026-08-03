'use server';

import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { eventFormSchema } from '@/lib/validation/event';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export type EventActionState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
    }
  | undefined;

// Both ADMIN and OFFICER can manage events per our permission matrix — so
// this only checks "is anyone logged in," not a specific role. Contrast
// this with something like deleting officer accounts, which would need a
// stricter, role-specific check.
async function requireUser() {
  const session = await auth();
  if (!session?.user) {
    return null;
  }
  return session.user;
}

function parseEventInput(formData: FormData) {
  return eventFormSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    location: formData.get('location'),
    startsAt: formData.get('startsAt'),
    endsAt: formData.get('endsAt'),
  });
}

export async function createEventAction(
  _prevState: EventActionState,
  formData: FormData
): Promise<EventActionState> {
  const user = await requireUser();
  if (!user) {
    return { message: 'You must be signed in to create events.' };
  }

  const parsed = parseEventInput(formData);
  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: 'Please fix the errors below.',
    };
  }

  await prisma.event.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      location: parsed.data.location || null,
      startsAt: new Date(parsed.data.startsAt),
      endsAt: parsed.data.endsAt ? new Date(parsed.data.endsAt) : null,
      createdById: user.id,
    },
  });

  // Public /events and the dashboard list both cache their data — this
  // tells Next.js "the underlying data changed, throw away the cached
  // version of these pages next time they're requested."
  revalidatePath('/events');
  revalidatePath('/dashboard/events');
  redirect('/dashboard/events');
}

export async function updateEventAction(
  id: string,
  _prevState: EventActionState,
  formData: FormData
): Promise<EventActionState> {
  const user = await requireUser();
  if (!user) {
    return { message: 'You must be signed in to edit events.' };
  }

  const parsed = parseEventInput(formData);
  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: 'Please fix the errors below.',
    };
  }

  await prisma.event.update({
    where: { id },
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      location: parsed.data.location || null,
      startsAt: new Date(parsed.data.startsAt),
      endsAt: parsed.data.endsAt ? new Date(parsed.data.endsAt) : null,
    },
  });

  revalidatePath('/events');
  revalidatePath('/dashboard/events');
  redirect('/dashboard/events');
}

export async function deleteEventAction(id: string) {
  const user = await requireUser();
  if (!user) {
    return;
  }

  await prisma.event.delete({ where: { id } });

  revalidatePath('/events');
  revalidatePath('/dashboard/events');
}
