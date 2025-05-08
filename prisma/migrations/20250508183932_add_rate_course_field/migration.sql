/*
  Warnings:

  - A unique constraint covering the columns `[userId,courseId]` on the table `CourseRating` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CourseRating_userId_courseId_key" ON "CourseRating"("userId", "courseId");
