import { prisma } from "@/lib/db";
import { getOrCreateSingleton } from "@/lib/singleton";

export async function getAboutContent() {
  return getOrCreateSingleton(
    () => prisma.aboutContent.findUnique({ where: { id: "singleton" } }),
    () => prisma.aboutContent.create({ data: {} })
  );
}

export async function getCoreValues() {
  return prisma.coreValue.findMany({
    orderBy: [{ order: "asc" }, { title: "asc" }],
  });
}