/*
  Warnings:

  - You are about to drop the column `content` on the `Module` table. All the data in the column will be lost.
  - Changed the type of `type` on the `ModuleContent` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('text', 'video', 'image', 'pdf');

-- AlterTable
ALTER TABLE "Module" DROP COLUMN "content";

-- AlterTable
ALTER TABLE "ModuleContent" DROP COLUMN "type",
ADD COLUMN     "type" "ContentType" NOT NULL;
