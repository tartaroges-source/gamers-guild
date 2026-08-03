import { prisma } from '@/lib/db';
import type { Prisma } from '@/lib/generated/prisma';

type LogActivityInput = {
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  entityType: string;
  entityId: string;
  summary: string;
  performedById: string;
  performedByName: string;
  previousData?: Prisma.InputJsonValue;
  newData?: Prisma.InputJsonValue;
};

export async function logActivity(input: LogActivityInput) {
  await prisma.auditLog.create({ data: input });
}
