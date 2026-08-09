import { Prisma } from "@/lib/generated/prisma";

// Handles the case where two requests both see "no row exists yet" and
// both try to create it at once — one wins, the other would normally
// crash with a unique-constraint error. Instead, we just re-fetch
// whatever the winning request created.
export async function getOrCreateSingleton<T>(
  find: () => Promise<T | null>,
  create: () => Promise<T>
): Promise<T> {
  const existing = await find();
  if (existing) return existing;

  try {
    return await create();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const fallback = await find();
      if (fallback) return fallback;
    }
    throw error;
  }
}