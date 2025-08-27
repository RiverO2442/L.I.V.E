-- AlterTable
ALTER TABLE "public"."UserLessonProgress" ADD COLUMN     "accuracy" INTEGER,
ADD COLUMN     "attempts" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "lastAccess" DROP NOT NULL,
ALTER COLUMN "lastAccess" DROP DEFAULT;
