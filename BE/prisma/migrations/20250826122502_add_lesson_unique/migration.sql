/*
  Warnings:

  - A unique constraint covering the columns `[moduleId,title]` on the table `Lesson` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."QuizQuestion" ADD COLUMN     "lessonId" TEXT;

-- CreateTable
CREATE TABLE "public"."UserLessonProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "lastAccess" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserLessonProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserLessonProgress_userId_idx" ON "public"."UserLessonProgress"("userId");

-- CreateIndex
CREATE INDEX "UserLessonProgress_lessonId_idx" ON "public"."UserLessonProgress"("lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "UserLessonProgress_userId_lessonId_key" ON "public"."UserLessonProgress"("userId", "lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_moduleId_title_key" ON "public"."Lesson"("moduleId", "title");

-- AddForeignKey
ALTER TABLE "public"."QuizQuestion" ADD CONSTRAINT "QuizQuestion_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "public"."Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserLessonProgress" ADD CONSTRAINT "UserLessonProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserLessonProgress" ADD CONSTRAINT "UserLessonProgress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "public"."Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
