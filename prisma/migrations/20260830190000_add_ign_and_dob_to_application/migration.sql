-- AlterTable
ALTER TABLE "membership_applications" ADD COLUMN "dateOfBirth" TIMESTAMP(3),
ADD COLUMN "ign" TEXT;

-- AlterTable
ALTER TABLE "members" ADD COLUMN "ign" TEXT;