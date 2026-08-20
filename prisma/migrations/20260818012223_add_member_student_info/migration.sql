/*
  Warnings:

  - Added the required column `courseYear` to the `members` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `members` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "members" ADD COLUMN     "courseYear" TEXT NOT NULL,
ADD COLUMN     "studentId" TEXT NOT NULL;
