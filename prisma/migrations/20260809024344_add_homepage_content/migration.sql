-- CreateEnum
CREATE TYPE "HeroMediaType" AS ENUM ('IMAGE', 'VIDEO');

-- CreateTable
CREATE TABLE "homepage_content" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "heroMediaType" "HeroMediaType" NOT NULL DEFAULT 'IMAGE',
    "heroImageUrl" TEXT,
    "heroVideoUrl" TEXT,
    "heroTagline" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "homepage_content_pkey" PRIMARY KEY ("id")
);
