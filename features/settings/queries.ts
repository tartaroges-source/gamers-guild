import { prisma } from "@/lib/db";
import { getOrCreateSingleton } from "@/lib/singleton";

export async function getSiteSettings() {
  return getOrCreateSingleton(
    () => prisma.siteSettings.findUnique({ where: { id: "singleton" } }),
    () => prisma.siteSettings.create({ data: {} })
  );
}