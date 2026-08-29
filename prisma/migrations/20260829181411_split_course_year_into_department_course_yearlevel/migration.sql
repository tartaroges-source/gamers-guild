/*
  Warnings:

  - You are about to drop the column `courseYear` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `courseYear` on the `membership_applications` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `members` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[studentId]` on the table `members` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `course` to the `members` table without a default value. This is not possible if the table is not empty.
  - Added the required column `department` to the `members` table without a default value. This is not possible if the table is not empty.
  - Added the required column `yearLevel` to the `members` table without a default value. This is not possible if the table is not empty.
  - Added the required column `course` to the `membership_applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `department` to the `membership_applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `yearLevel` to the `membership_applications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "members" DROP COLUMN "courseYear",
ADD COLUMN     "course" TEXT NOT NULL,
ADD COLUMN     "department" TEXT NOT NULL,
ADD COLUMN     "yearLevel" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "membership_applications" DROP COLUMN "courseYear",
ADD COLUMN     "course" TEXT NOT NULL,
ADD COLUMN     "department" TEXT NOT NULL,
ADD COLUMN     "yearLevel" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "members_email_key" ON "members"("email");

-- CreateIndex
CREATE UNIQUE INDEX "members_studentId_key" ON "members"("studentId");
