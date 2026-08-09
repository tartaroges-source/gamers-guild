import { prisma } from "@/lib/db";
import { getOrCreateSingleton } from "@/lib/singleton";

export async function getHomepageContent() {
  return getOrCreateSingleton(
    () => prisma.homepageContent.findUnique({ where: { id: "singleton" } }),
    () => prisma.homepageContent.create({ data: {} })
  );
}