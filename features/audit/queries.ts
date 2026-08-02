import { prisma } from "@/lib/db";

export async function getRecentActivity(limit = 100) {
  return prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}