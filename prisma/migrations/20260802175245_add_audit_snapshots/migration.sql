-- AlterTable
ALTER TABLE "audit_logs" ADD COLUMN     "newData" JSONB,
ADD COLUMN     "previousData" JSONB;
