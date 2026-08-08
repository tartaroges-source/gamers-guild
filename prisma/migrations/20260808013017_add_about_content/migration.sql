-- AlterTable
ALTER TABLE "site_settings" ADD COLUMN     "aboutHeroImageUrl" TEXT,
ADD COLUMN     "aboutIntro" TEXT,
ADD COLUMN     "coreValues" TEXT,
ADD COLUMN     "gamingCommunities" TEXT,
ADD COLUMN     "mission" TEXT,
ADD COLUMN     "vision" TEXT,
ADD COLUMN     "whatWeDo" TEXT,
ADD COLUMN     "whyJoinUs" TEXT;

-- CreateTable
CREATE TABLE "about_content" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "heroImageUrl" TEXT,
    "heroTagline" TEXT,
    "whoWeAre" TEXT,
    "mission" TEXT,
    "vision" TEXT,
    "whatWeDo" TEXT,
    "gamingCommunities" TEXT,
    "whyJoin" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "about_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_values" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "core_values_pkey" PRIMARY KEY ("id")
);
